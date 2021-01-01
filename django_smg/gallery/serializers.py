import json
import re

from rest_framework import serializers
from .models import Gallery, Song, SongGroup


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('songId', 'galleries')

class SongGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = SongGroup
        fields = ('group_name',)


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = (
            'title',
            'description',
            'slug',
            'pk',
        )


class GalleryDatasetSerializer(serializers.Serializer):
    """
    Brings together information from the following models to create or render
    galleries in a single request:

    - Gallery
    - Song
    - SongGroup
    """
    title = serializers.CharField(max_length=100, allow_blank=False)
    description = serializers.CharField(max_length=1e10, allow_blank=False)
    songData = serializers.JSONField()

    @ staticmethod
    def get_queryset(slug=None, max_galleries=10, gallery=None):
        """
        **CAREFUL! This returns a dict of querysets and model instances; not
        a regular queryset.
        """
        if not gallery and not slug:
            raise Exception('Must pass gallery object or gallery slug')
        if not gallery:
            gallery = Gallery.objects.get(slug=slug)  # type: ignore
        songs = Song.objects.select_related(
            'gallery',
            'group'
                ).filter(
                    gallery=gallery
                        ).order_by(
                            'created'
                        )[:max_galleries]

        groups = SongGroup.objects.filter(gallery=gallery)  # type: ignore
        return {
            'gallery': gallery,
            'songs': songs,
            'groups': groups
        }

    def render_many(self):
        """
        Render all of the user's galleries in a list.
        """
        return [
            self.render(gallery=g)
            for g in
            Gallery.objects.filter(
                owner=self.context.get('user')
                ).prefetch_related(  # type: ignore
                    'songs',
                    'song_groups',
                )
        ]

    def render(self, slug=None, gallery=None):
        """
        Give the frontend the whole structured blob necessary for it to render
        a gallery at once.
        """
        if not slug and not gallery:
            raise Exception('Must pass gallery object or gallery slug')
        if gallery:
            data = self.get_queryset(gallery=gallery)
        else:
            data = self.get_queryset(slug=slug)
        gallery = data['gallery']
        groups = data['groups']
        output = {
            'slug': gallery.slug,
            'pk': gallery.pk,
            'title': gallery.title,
            'description': gallery.description,
        }
        rendered_groups = []
        for group in groups:
            group_songs = []
            for song in Song.objects.filter(id__in=data['songs'], group=group):  # type: ignore
                group_songs.append((song.student_name, song.songId))
            rendered_groups.append(group_songs)
        output['songData'] = rendered_groups
        return output


    def create(self, validated_data):
        """
        Create new gallery, to which everything else will relationally linked.
        """
        self._gallery = Gallery.objects.create(  # type: ignore
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
        # bulk create SongGroups
        song_groups = []
        for group in song_data:
            song_groups.append(SongGroup(
                group_name=group[-1],
                gallery=self._gallery
            ))

        SongGroup.objects.bulk_create(song_groups)  # type: ignore
        # need to re-fetch ForeignKeys for later
        song_groups = SongGroup.objects.filter(gallery=self._gallery)  # type: ignore

        # bulk create Songs
        songs = []
        for group in song_data:
            group_obj = song_groups.get(group_name=group[-1])
            for row in group[:-1]:
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
                songs.append(Song(
                    songId=songId,
                    student_name=name,
                    gallery=self._gallery,
                    group=group_obj
                ))
        songs = Song.objects.bulk_create(songs)  # type: ignore

    def get_user(self):
        """
        Safely get the user or raise a descriptive exception.
        """
        user = self.context.get('user')
        if not user:
            raise Exception('Current request context has no user')
        return user

    @ staticmethod
    def validate_songData(song_data):
        """
        Check shape of data structure: a list of lists of two strings.
        """
        if isinstance(song_data, str):
            song_data = json.loads(song_data)
        elif isinstance(song_data, dict):
            song_data = json.loads(song_data.get('songData'))
        try:
            assert isinstance(song_data, list)
            for group in song_data:
                assert isinstance(group[-1], str)
                assert isinstance(group, list)
                for row in group[:-1]:
                    assert isinstance(row, list)
                    assert len(row) == 2
                    assert re.match(
                        r'http(s)?://musiclab.chromeexperiments.com/Song-Maker/'
                        r'song/(\d){16}',
                        row[1]
                    )
        except AssertionError:
            raise serializers.ValidationError({
                'message': 'songData is not valid'
            })
        return song_data
