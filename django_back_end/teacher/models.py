import uuid

from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

from django_mysql.models import JSONField

class Gallery(models.Model):
    owner = models.ForeignKey(
        User,
        related_name='gallery',
        on_delete=models.CASCADE,
    )
    public_id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4(),
        editable=False,
    )
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    api_obj = JSONField(default=list)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _('Gallery')
        verbose_name_plural = _('Galleries')

 