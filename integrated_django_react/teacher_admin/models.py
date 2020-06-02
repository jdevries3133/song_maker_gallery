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

        super().save(*args, **kwargs)


    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('Gallery')
        verbose_name_plural = _('Galleries')
