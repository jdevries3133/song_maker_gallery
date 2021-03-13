import base64
import logging
import json
import re

from django.http import Http404
from rest_framework import serializers

from .models import Gallery, Song, SongGroup
from .services import iter_fetch_and_cache

logger = logging.getLogger(__name__)

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
    def get_queryset(slug=None, gallery=None):
        """
        **CAREFUL! This returns a dict of querysets and model instances; not
        a regular queryset.
        """
        if not gallery and not slug:
            raise Exception('Must pass gallery object or gallery slug')
        if not gallery:
            try:
                gallery = Gallery.objects.get(slug=slug)  # type: ignore
            except Gallery.DoesNotExist:  # type: ignore
                raise Http404
        songs = Song.objects.select_related(  # type: ignore
            'gallery',
            'group'
                ).filter(
                    gallery=gallery
                        ).order_by(
                            'created'
                        )

        groups = SongGroup.objects.filter(gallery=gallery)  # type: ignore
        return {
            'gallery': gallery,
            'songs': songs,
            'groups': groups
        }

    def render_many(self, *, max_galleries=None) -> list:
        """
        Render all the user's galleries, or a certain amount sorted
        by date created.
        """
        queryset = [
            self.render(gallery=g) for g in
            Gallery.objects.filter(  # type: ignore
                owner=self.context.get('user')
            ).order_by(
                'created'
            ).prefetch_related(
                'songs',
                'song_groups'
            )
        ]
        return queryset if not max_galleries else queryset[:max_galleries]

    def render(self, slug=None, gallery=None) -> dict:
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
            for song in iter_fetch_and_cache(
                songs=Song.objects.filter(id__in=data['songs'], group=group)   #type: ignore
            ):
                # this should really be defined as some sort of serializer in
                # its own rite.
                group_songs.append({
                    "name": song.student_name,
                    "songId": song.songId,
                    "midiBytes": base64.b64encode(song.midi),
                    "metadata": {
                        "bars": song.bars,
                        "beats": song.beats,
                        "instrument": song.instrument,
                        "octaves": song.octaves,
                        "percussion": song.percussion,
                        "percussionNotes": song.percussionNotes,
                        "rootNote": song.rootNote,
                        "rootOctave": song.rootOctave,
                        "rootPitch": song.rootPitch,
                        "scale": song.scale,
                        "subdivision": song.subdivision,
                        "tempo": song.tempo,
                    }
                })
            group_songs.append(group.group_name)
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
                full_name = row[0].strip()  # thanks Wendy!
                songId = row[1].strip()[-16:]
                name_arr = [i for i in full_name.split(' ') if i]
                if len(name_arr) > 1:
                    name = (
                        name_arr[0].title()
                        + ' '
                        + name_arr[-1][0].upper() + '.'
                    )
                else:
                    if name_arr:
                        name = name_arr[0]
                    else:
                        name = ''
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
            song_data = json.loads(song_data.get('songData'))  # type: ignore
        assert isinstance(song_data, list)

        validation_errors = []

        try:
            group_names = set()
            for group in song_data:
                if group[-1] in group_names:
                    validation_errors += [
                        'Spreadsheet data is not valid',
                        f'Two spreadsheets named {group[-1]} are not allowed.'
                        'Group names must be unique.'
                    ]
                    continue
                group_names.update(group[-1])
                for rownum, row in enumerate(group[:-1], start=1):
                    row = [r for r in row if r]
                    if not row:
                        validation_errors.append(
                            f'The spreadsheet for the group, "{group[-1]}," '
                            f'row {rownum} is empty'
                        )
                        continue
                    if len(row) != 2:
                        validation_errors += [
                            f'Row #{rownum} of the spreadsheet for your '
                            f'group, "{group[-1]}," does not contain two items. '
                            f'Instead, it contains: "{", ".join(row)}".'
                        ]
                        continue
                    if not re.match(
                        r'http(s)?://musiclab.chromeexperiments.com/Song-Maker/'
                        r'song/(\d){16}',
                        row[1].strip()
                    ):
                        validation_errors += [
                            'An error occured while parsing the spreadsheet '
                            f'for your group named, "{group[-1]}." '
                            f'The Song Maker link for {row[0]} ({row[1]}) is '
                            f'not valid. (row #{rownum})'
                        ]
        except Exception as e:
            logger.error(f'Validation failed due to error: {e}')
            logger.error(f'songData: {song_data}')
            validation_errors.append('Invalid spreadsheet data.')
        if validation_errors:
            raise serializers.ValidationError(validation_errors)
        return song_data
