import re
from django.db import models
from django.contrib.auth.models import User
from django.db.models.query_utils import Q
from django.utils.translation import gettext_lazy as _

from .managers import OrderManager, SlugManager


class Gallery(models.Model):
    owner = models.ForeignKey(
        User,
        related_name='galleries',
        on_delete=models.CASCADE,
    )
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(
        max_length=100,
        null=False,
        blank=False,
    )
    description = models.TextField()

    objects = SlugManager()
    slug = models.SlugField(
        max_length=50,
        unique=True
    )



    def __str__(self):
        return str(self.title)

    class Meta:
        verbose_name = _('Gallery')
        verbose_name_plural = _('Galleries')


class SongGroup(models.Model):
    """
    Songs in the gallery are visually grouped. This model defines the grouping.
    """
    created = models.DateTimeField(auto_now_add=True)
    group_name = models.CharField(_("Group Name"), max_length=100)

    # relationships
    owner = models.ForeignKey(
        User,
        related_name='song_groups',
        on_delete=models.CASCADE,
    )
    gallery = models.ForeignKey(
        Gallery,
        on_delete=models.CASCADE,
        related_name='song_groups',
        null=True
    )

    # order of this SongGroup withing the Gallery
    order = models.IntegerField(null=True)
    objects = OrderManager('gallery')

    def __str__(self):
        return str(self.group_name)


class Song(models.Model):
    """
    A single song that is part of a gallery. Contains cached midi files and
    json objects from the Chrome Music Lab site.
    """
    created = models.DateTimeField(auto_now_add=True)
    songId = models.CharField(_("Song ID"), max_length=20)
    student_name = models.CharField(_("Student Name"), max_length=100)

    # relationships
    owner = models.ForeignKey(
        User,
        related_name='songs',
        on_delete=models.CASCADE,
    )
    gallery = models.ForeignKey(
        Gallery,
        on_delete=models.CASCADE,
        related_name='songs',
        null=True
    )
    group = models.ForeignKey(
        SongGroup,
        on_delete=models.CASCADE,
        related_name='songs',
        null=True
    )

    # order of this song withing the SongGroup
    order = models.IntegerField(null=True)
    objects = OrderManager('group')

    # worker will respond to this field and update it when pulling down data
    # into cache.
    is_cached = models.BooleanField(default=False)

    # data that will be cached
    bars = models.IntegerField(null=True)
    beats = models.IntegerField(null=True)
    instrument = models.CharField(max_length=50, null=True)
    octaves = models.IntegerField(null=True)
    percussion = models.CharField(max_length=50, null=True)
    percussionNotes = models.IntegerField(null=True)
    rootNote = models.IntegerField(null=True)
    rootOctave = models.IntegerField(null=True)
    rootPitch = models.IntegerField(null=True)
    scale = models.CharField(max_length=50, null=True)
    subdivision = models.IntegerField(null=True)
    tempo = models.IntegerField(null=True)

    midi = models.BinaryField(null=True)

    def __str__(self):
        return f'{self.student_name} ({self.songId})'
