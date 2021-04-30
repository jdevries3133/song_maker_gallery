import base64
import logging
import json
import re

from django.http import Http404
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Gallery, Song, SongGroup
from .services import (
    iter_fetch_and_cache,
    normalize_songId,
    normalize_student_name,
    depr_validate_spreadsheet_data,
)

logger = logging.getLogger(__name__)


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = (
            'songId',           'student_name',     'order',        'bars',
            'beats',            'instrument',       'octaves',      'percussion',
            'percussionNotes',  'rootNote',         'rootOctave',   'rootPitch',
            'scale',            'subdivision',      'tempo',        'midi'
        )

    def create(self, validated_data):
        return Song.objects.create(**validated_data)

    def validate_student_name(self, value):
        return normalize_student_name(value)

    def validate_songId(self, value):
        """
        Must be 16 character numeric string.
        """
        value = normalize_songId(value)
        if not value.isnumeric():
            raise ValidationError('songId must be numeric')
        if not len(value) == 16:
            raise ValidationError('songId must be 16 characters in length')
        return value


class SongGroupSerializer(serializers.ModelSerializer):
    songs = SongSerializer(many=True)

    class Meta:
        model = SongGroup
        fields = ('group_name', 'songs')

    def create(self, validated_data, **kw):
        song_data = validated_data.pop('songs')
        song_serializer = self.fields['songs']  # type: ignore
        instance = SongGroup.objects.create(**validated_data)
        for each in song_data:
            each['group'] = instance
            each['gallery'] = instance.gallery
        song_serializer.create(song_data)
        return instance


class GallerySerializer(serializers.ModelSerializer):
    song_groups = SongGroupSerializer(many=True)

    class Meta:
        model = Gallery
        fields = (
            'pk',
            'title',
            'description',
            'song_groups',
        )

    def create(self, validated_data):
        # pop off related data and serializer
        group_data = validated_data.pop('song_groups')
        group_serializer = self.fields['song_groups']  # type: ignore

        # assign owner
        validated_data['owner'] = self.context.get('user')
        instance = Gallery.objects.create(**validated_data)
        for each in group_data:
            each['gallery'] = instance
        result = group_serializer.create(group_data)
        return instance

    def validate_song_groups(self, value):
        """
        Group names must be unique together.
        """
        if value is None:
            return
        seen = set()
        for group in value:
            if (group_name := group.get('group_name')) is not None:
                if group_name in seen:
                    raise ValidationError(
                        f'Group names must be unique. The name {group_name} was '
                        'repeated'
                    )
                else:
                    seen.add(group_name)
        return value
