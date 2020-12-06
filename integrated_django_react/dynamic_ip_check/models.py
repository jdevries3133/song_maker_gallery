from django.db import models


class LastIP(models.Model):
    last_ip = models.CharField(max_length=16, null=False)

    class Meta:
        verbose_name = 'Last IP'
