import re
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django_mysql.models import JSONField


class Gallery(models.Model):
    owner = models.ForeignKey(
        User,
        related_name='gallery',
        on_delete=models.CASCADE,
        null=True,
    )
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(
        max_length=100,
        null=False,
        blank=False,
    )
    url_extension = models.CharField(
        max_length=100,
        default='unassigned',  # will be assigned by save overwrite
        blank=True,
        primary_key=True,
    )
    description = models.TextField()

    def save(self, *args, **kwargs):
        """
        Save with the url extension as the primary key for easy lookups. If
        the url is taken, append a number to the url until there are no more
        naming conflicts.
        """
        # pylint: disable=no-member,signature-differs,pointless-string-statement
        if self.url_extension != 'unassigned':
            super().save(*args, **kwargs)
            return
        self.url_extension = self.title.__str__().lower().replace(' ', '-')
        outstr = ''
        for i in self.url_extension:
            if re.search(r'[a-zA-Z0-9\-]', i):
                outstr += i
        self.url_extension = outstr
        conflicting_urls = [i.url_extension for i in Gallery.objects.filter(
            url_extension__contains=self.url_extension)]
        if conflicting_urls:
            append_int = 1
            self.url_extension += str(append_int)
            while self.url_extension in conflicting_urls:
                # will this cause an inifnite loop?? I don't know yet...
                self.url_extension = self.url_extension[:-1] + str(append_int)
                append_int += 1

        # convert names to first name, last initial with proper case
        # also, insert placeholder image

        # TODO: this will be used differently; possibly lifted into the viewset

        """
                """

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title.__str__()

    class Meta:
        verbose_name = _('Gallery')
        verbose_name_plural = _('Galleries')


class SongGroup(models.Model):
    """
    Songs in the gallery are visually grouped. This model defines the grouping.
    """
    group_name = models.CharField(_("Group Name"), max_length=100)
    gallery = models.OneToOneField(Gallery, on_delete=models.CASCADE)


class Song(models.Model):
    """
    A single song that is part of a gallery. Contains cached midi files and
    json objects from the Chrome Music Lab site.
    """
    songId = models.CharField(_("Song ID"), max_length=50, primary_key=True)

    # relationships
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE)
    group = models.ForeignKey(SongGroup, on_delete=models.CASCADE)

    student_name = models.CharField(_("Student Name"), max_length=100)

    # worker will respond to this field and update it when pulling down data
    # into cache.
    isCached = models.BooleanField(default=False)
    # data that comes from the cache
    json = JSONField()
    midi = models.BinaryField()
