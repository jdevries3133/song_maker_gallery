import logging

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

    pk = serializers.IntegerField(read_only=False, required=False)
    owner = serializers.PrimaryKeyRelatedField(
        allow_null=True, read_only=True, default=SongOwner()
    )

    class Meta:
        model = Song
        fields = (
            "pk",
            "songId",
            "student_name",
            "order",
            "bars",
            "beats",
            "instrument",
            "octaves",
            "percussion",
            "percussionNotes",
            "rootNote",
            "rootOctave",
            "rootPitch",
            "scale",
            "subdivision",
            "tempo",
            "midi",
            "owner",
            "group",
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
            raise ValidationError("songId must be numeric")
        if not len(value) == 16:
            raise ValidationError("songId must be 16 characters in length")
        return value


class SongListSerializer(serializers.ListSerializer):
    child = SongSerializer()

    def update(self, instances, validated_data):
        instances_map = {i.pk: i for i in instances}
        data_map = {i['pk'] : i for i in validated_data}
        ret = []
        for pk, song in data_map.items():
            if pk in instances_map:
                instance = instances_map[pk]
                ret.append(self.child.update(instance, song))
            else:
                ret.append(self.child.create(song))

        # items not included are deleted
        for pk, item in instances_map.items():
            if pk not in data_map:
                item.delete()

        return ret


class SongGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = SongGroup
        fields = ("group_name", "songs", "owner", "pk")

    pk = serializers.IntegerField(read_only=False, required=False)
    songs = SongListSerializer()
    owner = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )

    def get_queryset(self):
        # filter to songs in this group
        return Song.objects.filter(
            group=self.instance, owner=self.context["request"].user
        )

    def to_representation(self, instance):
        """
        Hijack point for song fetching.
        """
        if instance.songs.filter(is_cached=False).count() > 0:
            fetch_and_cache(songs=instance.songs.all())
        representation = super().to_representation(instance)
        representation['songs'].sort(key=lambda i: i['order'])
        return representation

    def create(self, validated_data, **_):
        song_data = validated_data.pop("songs")
        song_serializer = self.fields["songs"]  # type: ignore
        instance = SongGroup.objects.create(
            owner=self.context["request"].user, **validated_data
        )
        for each in song_data:
            each["group"] = instance
            each["gallery"] = instance.gallery
        song_serializer.create(song_data)
        return instance

    def update(self, instance, validated_data, **_):
        song_data = validated_data.pop("songs")
        for each in song_data:
            each["group"] = instance.pk
            each["gallery"] = instance.gallery.pk
        serializer = SongListSerializer(
            self.get_queryset(), data=song_data, context=self.context
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        instance.group_name = validated_data.get('group_name', instance.group_name)
        instance.owner = validated_data.get('owner', instance.owner)
        instance.save()

        return instance


class PrivatePublicGallerySerializer(serializers.ModelSerializer):
    """Where the public view requests a gallery, this serializer is used if
    `is_public` is set to false. Note that this serializer only provides
    the most basic details."""

    class Meta:
        model = Gallery
        fields = ("pk", "slug", "is_public", "is_editable")


class GallerySerializer(serializers.ModelSerializer):

    song_groups = SongGroupSerializer(many=True)
    slug = serializers.CharField(max_length=50, required=False)
    owner = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Gallery
        fields = (
            "pk",
            "title",
            "owner",
            "description",
            "slug",
            "song_groups",
            "is_public",
            "is_editable",
        )

    def create(self, validated_data):
        groups_data = validated_data.pop("song_groups")
        gallery = Gallery.objects.create(
            owner=self.context["request"].user, **validated_data
        )
        songs = []
        for group_data in groups_data:
            songs_data = group_data.pop("songs")
            group = SongGroup.objects.create(
                owner=self.context["request"].user, gallery=gallery, **group_data
            )
            for song in songs_data:
                songs.append(
                    Song(
                        owner=self.context["request"].user,
                        group=group,
                        gallery=gallery,
                        **song,
                    )
                )
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
            if (group_name := group.get("group_name")) is not None:
                if group_name in seen:
                    raise ValidationError(
                        f"Group names must be unique. The name {group_name} was "
                        "repeated"
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
        default=serializers.CurrentUserDefault(),
    )

    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = Gallery
        fields = ("owner", "pk", "slug", "title", "description")


class GallerySummarySerializer(serializers.ModelSerializer):
    """
    This makes it possible to GET a gallery entity but delay fetching and
    caching if it is not necessary yet.
    """

    class Meta:
        model = Gallery
        fields = ("pk", "slug", "title", "description", "is_public", "is_editable")
