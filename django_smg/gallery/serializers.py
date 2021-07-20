import base64
import logging
import json
import re
from django.contrib.auth.models import AnonymousUser

from django.http import Http404
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Gallery, Song, SongGroup
from .services import (
    fetch_and_cache,
    normalize_student_name,
)

logger = logging.getLogger(__name__)


################################################################################

            # Default serializers for Gallery, SongGroup, and Song entities

################################################################################

class SongOwner(serializers.CurrentUserDefault):

    def __call__(self, serializer_filed):
        user = super().__call__(serializer_filed)
        if user.is_authenticated:
            return user


class SongSerializer(serializers.ModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(
        allow_null=True,
        read_only=True,
        default=SongOwner()
    )

    class Meta:
        model = Song
        fields = (
            'songId',           'student_name',     'order',        'bars',
            'beats',            'instrument',       'octaves',      'percussion',
            'percussionNotes',  'rootNote',         'rootOctave',   'rootPitch',
            'scale',            'subdivision',      'tempo',        'midi',
            'owner',            'group'
        )

    def create(self, validated_data):
        return Song.objects.create(**validated_data)

    def validate_student_name(self, value):
        return normalize_student_name(value)

    def validate_songId(self, value):
        """
        Must be 16 character numeric string.
        """
        if not value.isnumeric():
            raise ValidationError('songId must be numeric')
        if not len(value) == 16:
            raise ValidationError('songId must be 16 characters in length')
        return value


class SongGroupSerializer(serializers.ModelSerializer):

    songs = SongSerializer(many=True)
    owner = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault()
    )

    def to_representation(self, instance):
        """
        Hijack point for song fetching.
        """
        if instance.songs.filter(is_cached=False).count() > 0:
            fetch_and_cache(songs=instance.songs.all())
        return super().to_representation(instance)

    class Meta:
        model = SongGroup
        fields = ('group_name', 'songs', 'owner', 'pk')

    def create(self, validated_data, **kw):
        song_data = validated_data.pop('songs')
        song_serializer = self.fields['songs']  # type: ignore
        instance = SongGroup.objects.create(
            owner=self.context['request'].user,
            **validated_data
        )
        for each in song_data:
            each['group'] = instance
            each['gallery'] = instance.gallery
        song_serializer.create(song_data)
        return instance


class GallerySerializer(serializers.ModelSerializer):

    song_groups = SongGroupSerializer(many=True)
    slug = serializers.CharField(max_length=50, required=False)
    owner = serializers.PrimaryKeyRelatedField(
        read_only=True,
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Gallery
        fields = (
            'pk',
            'title',
            'owner',
            'description',
            'slug',
            'song_groups',
        )

    def create(self, validated_data):
        groups_data = validated_data.pop('song_groups')
        gallery = Gallery.objects.create(
            owner=self.context['request'].user,
            **validated_data
        )
        songs = []
        for group_data in groups_data:
            songs_data = group_data.pop('songs')
            group = SongGroup.objects.create(
                owner=self.context['request'].user,
                gallery=gallery,
                **group_data
            )
            for song in songs_data:
                songs.append(Song(
                    owner=self.context['request'].user,
                    group=group,
                    gallery=gallery,
                    **song
                ))
        Song.objects.bulk_create(songs)
        return gallery

    def validate_slug(self, value):
        """
        Slug is dealt with by the model manager, so it can bypass validation.
        """
        return value

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

################################################################################

            # Custom serializers, mainly for optimizing common operations

################################################################################

class GalleryUpdateSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),  # type: ignore
        default=serializers.CurrentUserDefault()
    )

    slug = serializers.SlugField(read_only=True)
    class Meta:
        model = Gallery
        fields = ('owner', 'pk', 'slug', 'title', 'description')

class GallerySummarySerializer(serializers.ModelSerializer):
    """
    This makes it possible to GET a gallery entity but delay fetching and
    caching if it is not necessary yet.
    """
    class Meta:
        model = Gallery
        fields = ('pk', 'slug', 'title', 'description',
                  'is_public', 'is_editable')
