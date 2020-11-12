import re

from django.db.models import Q
from rest_framework.serializers import Serializer, ModelSerializer, ValidationError
from .models import Gallery, Song, SongGroup, StudentName


class SongSerializer(ModelSerializer):
    class Meta:
        model = Song
        fields = ('songId', 'galleries')

class SongGroupSerializer(ModelSerializer):
    class Meta:
        model = SongGroup
        fields = ('group_name',)


class GallerySerializer(ModelSerializer):
    class Meta:
        model = Gallery
        fields = (
            'title',
            'description',
            'slug',
        )


class GalleryDatasetSerializer(Serializer):
    """
    Brings together information from the following models to create or render
    galleries in a single request:

    - Gallery
    - Song
    - SongGroup
    """
    def get_queryset(self, slug, max_galleries=10):
        return Gallery.objects.filter(slug=slug).prefetch_related('Song').prefetch_related('StudentName').prefetch_related('SongGroup')

    def render(self, slug):
        """
        Give the frontend the whole structured blob necessary for it to render
        a gallery at once.
        """
        # TODO: THIS IS VERY INEFFICIENT it does not simply hit the database; it batters it.
        queryset = self.get_queryset(slug)
        gallery = Gallery.objects.get(slug=slug)
        groups = SongGroup.objects.filter(gallery=gallery)
        output = {
            'title': gallery.title,
            'description': gallery.description,
        }
        rendered_groups = []
        for group in groups:
            group_songs = []
            for song in Song.objects.filter(groups=group):
                id = song.songId
                st_name = StudentName.objects.filter(song=song).filter(gallery=gallery)[0]
                group_songs.append((st_name.name, id))
            rendered_groups.append(group_songs)
        output['songData'] = rendered_groups
        return output


    def create(self, validated_data):
        """
        Create new gallery, to which everything else will relationally linked.
        """
        # TODO: THIS IS VERY INEFFICIENT it does not simply hit the database; it batters it.
        self._gallery = Gallery.objects.create(
            owner=self.get_user() ,
            title=validated_data['title'],
            description=validated_data['description'],
            slug=Gallery.generate_slug(validated_data['title'])
        )
        self.parse_song_data(validated_data['songData'])
        return self._gallery

    def parse_song_data(self, song_data):
        """
        Parse nested list of groups and songs. Create SongGroups and Songs.
        """
        # TODO: THIS IS VERY INEFFICIENT it does not simply hit the database; it batters it.
        for group in song_data:
            group_name = group.pop()
            song_group = SongGroup.objects.create(
                group_name=group_name,
                gallery=self._gallery
            )
            for row in group:
                # change names to first name, last initial
                full_name = row[0]
                songId = row[1][-16:]
                name_arr = full_name.split(' ')
                if len(name_arr) > 1:
                    name = (
                        name_arr[0].title()
                        + ' '
                        + name_arr[-1][0].upper() + '.'
                    )
                else:
                    name = name_arr[0]
                try:
                    existing_song = Song.objects.get(pk=songId)
                    if not self._gallery in existing_song.galleries.all():
                        existing_song.galleries.add(self._gallery)
                    if not song_group in existing_song.groups.all():
                        existing_song.groups.add(song_group)
                    StudentName.objects.create(
                        name=name,
                        song=existing_song,
                        gallery=self._gallery
                    )
                except Song.DoesNotExist:
                    song = Song.objects.create(
                        songId=songId,
                    )
                    song.galleries.add(self._gallery)
                    song.groups.add(song_group)
                    StudentName.objects.create(
                        name=name,
                        song=song,
                        gallery=self._gallery
                    )


    def get_user(self):
        """
        Safely get the user or raise a descriptive exception.
        """
        user = self.context.get('user')
        if not user:
            raise Exception('Current request context has no user')
        return user

    def validate(self, data):
        data = self.initial_data  # no idea why data variable is empty
        for key in ['title', 'description', 'songData']:
            if not key in data:
                raise ValidationError({
                    'message': f'{key} not provided in request data'
                })
            validate = self._get_validator(key)
            try:
                validate(data[key])
            except AssertionError:
                raise ValidationError({
                    'message': f'{key} is not valid.'
                })
        return data

    def _get_validator(self, key):
        return {
            'title': self.validate_title,
            'description': self.validate_description,
            'songData': self.validate_song_data
        }.get(key)

    def validate_title(self, title):
        assert len(title) < 100

    def validate_description(self, description):
        pass

    def validate_song_data(self, song_data):
        # check shape of data structure: a list of lists of two strings.
        assert isinstance(song_data, list)
        for group in song_data:
            assert isinstance(group[-1], str)  # pop out the group name
            assert isinstance(group, list)
            for row in group[:-1]:
                assert isinstance(row, list)
                assert len(row) == 2
                assert re.match(
                    r'http(s)?://musiclab.chromeexperiments.com/Song-Maker/song/'
                    r'(\d){16}',
                    row[1]
                )
