import re
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django.utils.text import slugify


class Gallery(models.Model):
    owner = models.ForeignKey(
        User,
        related_name='gallery',
        related_query_name='galleries',
        on_delete=models.CASCADE,
        null=True,
    )
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(
        max_length=100,
        null=False,
        blank=False,
    )
    slug = models.SlugField(
        max_length=50,
        unique=True
    )
    description = models.TextField()

    @staticmethod
    def generate_slug(title):
        """
        Generates a unique url extension given a title, avoiding url extensions
        currently in the database.

        THE URL_EXTENSION RETURNED BY THIS FUNCTION MAY BE CONCURRENCY UNSAFE,

        A portion of the codebase that assigns a model's url extension
        with this function should be prepared that a separate worker is
        doing the same thing at the same time. A simultaneous database write
        with the same slug is unlikely but possible, so integrity
        and operational errors should be caught and a new unique slug
        should be fetched and tried again.
        """
        slug = slugify(title)
        outstr = ''
        for i in slug:
            if re.search(r'[a-zA-Z0-9\-]', i):
                outstr += i
        slug = outstr
        conflicting_urls = [
            i.slug for i in Gallery.objects.filter(
                slug__contains=slug
            )
        ]
        if conflicting_urls:
            append_int = 1
            slug += '-' + str(append_int)
            while slug in conflicting_urls:
                append_int += 1
                slug = (
                    slug[:-len(str(append_int - 1))]
                    + str(append_int)
                )
        return slug

    def __str__(self):
        return str(self.title)

    class Meta:
        verbose_name = _('Gallery')
        verbose_name_plural = _('Galleries')


class SongGroup(models.Model):
    """
    Songs in the gallery are visually grouped. This model defines the grouping.
    """
    group_name = models.CharField(_("Group Name"), max_length=100)
    gallery = models.ForeignKey(
        Gallery,
        on_delete=models.CASCADE,
        related_name='song_groups',
    )

    def __str__(self):
        return str(self.group_name)


class Song(models.Model):
    """
    A single song that is part of a gallery. Contains cached midi files and
    json objects from the Chrome Music Lab site.
    """
    songId = models.CharField(_("Song ID"), max_length=20)
    student_name =  models.CharField(_("Student Name"), max_length=100)

    # relationships
    gallery = models.ForeignKey(
        Gallery,
        on_delete=models.CASCADE,
        related_name='songs',
    )
    group = models.ForeignKey(
        SongGroup,
        on_delete=models.CASCADE,
        related_name='song',
        related_query_name='songs'
    )

    # worker will respond to this field and update it when pulling down data
    # into cache.
    isCached = models.BooleanField(default=False)

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
