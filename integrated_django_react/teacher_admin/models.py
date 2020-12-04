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
    api_obj = JSONField(default=list)
    needs_screenshot = models.BooleanField(default=True)
    is_new = models.BooleanField(default=True)  # monkey patch for url extension maker

    def save(self, *args, **kwargs):
        # this save method is tragically flawed
        # I should just not mess with the default primary_key
        # On the public side, I should just filter .all() by the url_extension,
        # and call it a day.

        # anytime you try to update the model, it becomes duplicated with a new
        # url extension, and the old one just hangs around. Plus, I think the
        # api serializer.data ends up being wrong because of this, too.
        if not self.is_new:
            super().save(args, kwargs)
            return
        self.url_extension = self.title.lower().replace(' ', '-')
        outstr = ''
        for i in self.url_extension:
            if re.search(r'[a-zA-Z0-9\-]', i):
                outstr += i
        self.url_extension = outstr
        conflicting_urls = [i.url_extension for i in Gallery.objects.filter(
            url_extension__contains=self.url_extension)]
        if conflicting_urls:
            append_int = 1
            while True:
                new_url = self.url_extension + str(append_int)
                if new_url in conflicting_urls:
                    append_int += 1
                else:
                    self.url_extension = new_url
                    break

        # convert names to first name, last initial with proper case
        # also, insert placeholder image
        for group in self.api_obj:
            for index, row in enumerate(group[:-1]):

                # fixing names
                full_name = row[0]
                name_arr = full_name.split(' ')
                if len(name_arr) > 1:
                    # Changes names longer than one words to first name last initial.
                    name = name_arr[0].title() + ' ' + \
                        name_arr[-1][0].upper() + '.'
                else:
                    # do not change names that are only one word.
                    name = name_arr[0]
                    group[index][0] = name
                row.append(
                    'https://song-maker-gallery.s3.amazonaws.com/manually_added'
                    '/Placeholder.png'
                )

        self.is_new = False

        super().save(args, kwargs)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('Gallery')
        verbose_name_plural = _('Galleries')
