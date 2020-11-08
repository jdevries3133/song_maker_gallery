import re
from rest_framework.serializers import Serializer, ModelSerializer, ValidationError
from .models import Gallery, Song, SongGroup


class SongSerializer(ModelSerializer):
    class Meta:
        model = Song
        fields = ('songId', 'galleries')


class GallerySerializer(ModelSerializer):
    songs = SongSerializer(many=True)
    class Meta:
        model = Gallery
        fields = ('title', 'description', 'songs')


class GalleryDatasetSerializer(Serializer):
    """
    This is the entire API response with all gallery information, bringing
    together information from the following models:

    - Gallery
    - Song
    - SongGroup

    This provides all the information necessary to render a gallery, except
    the actual json and midi data for each individual song, which is requested
    for each song on the frontend.
    """
    def create(self, validated_data):
        gallery = Gallery.objects.create(
            owner=self.get_user() ,
            title=validated_data.data['title'],
            description=validated_data.data['description']
        )
        for group in validated_data['songData']:
            group_name = group.pop()
            song_group = SongGroup.objects.create(
                group_name=group_name,
                gallery=gallery
            )
            for row in group:
                # TODO: move this code to a beter place, such as within a
                # create or update method where it will be checked every time.

                # change names to first name, last initial
                full_name = row[0]
                print(row)
                print(full_name)
                name_arr = full_name.split(' ')
                if len(name_arr) > 1:
                    name = (
                        name_arr[0].title()
                        + ' '
                        + name_arr[-1][0].upper() + '.'
                    )
                else:
                    name = name_arr[0]

                songId = row[1][-16:]
                new_song = Song.objects.create(
                    songId=songId,
                    student_name=name,
                    gallery=gallery,
                    group=song_group
                )

    def get_user(self):
        """
        Safely get the user or raise a descriptive exception.
        """
        user = self.context.get('request').get('user')
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
        try:
            # check shape of data structure: a list of lists of two strings.
            assert isinstance(song_data, list)
            for group in song_data:
                assert isinstance(group.pop(), str)  # pop out the group name
                assert isinstance(group, list)
                for row in group:
                    assert isinstance(row, list)
                    assert len(row) == 2
                    assert re.match(
                        r'http(s)?://musiclab.chromeexperiments.com/Song-Maker/song/'
                        '(\d){16}',
                        row[1]
                    )
        except AssertionError:
            breakpoint()
