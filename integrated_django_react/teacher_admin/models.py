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
        default='err',  # will be assigned by save overwrite
        blank=True,
        primary_key=True,
    )
    description = models.TextField()
    api_obj = JSONField(default=list)
    needs_screenshot = models.BooleanField(default=True)

    def save(self, *args, **kwargs):

        # make unique url extension from tile
        self.url_extension = self.title.lower().replace(' ', '-')
        outstr = ''
        for i in self.url_extension:
            if re.search(r'[a-zA-Z0-9\-]', i):
                outstr += i
        self.url_extension = outstr
        conflicting_urls = [i.url_extension for i in Gallery.objects.filter(url_extension__contains=self.url_extension)]
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
        print('indic')
        print(self.api_obj)
        for group in self.api_obj:
            for index, row in enumerate(group[:-1]):
                full_name = row[0]
                name_arr = full_name.split(' ')
                if len(name_arr) > 1:
                    name= name_arr[0].title() + ' ' + name_arr[1][0].upper() + '.'
                else:
                    name = name_arr[0]
                print(name)
                group[index][0] = name

        super().save(*args, **kwargs)


    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('Gallery')
        verbose_name_plural = _('Galleries')
