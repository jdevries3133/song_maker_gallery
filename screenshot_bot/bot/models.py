from django.db import models
from django_mysql.models import JSONField

# Create your models here.
class ToDo(models.Model):
    url_extension = models.CharField(max_length=100)
    api_obj = JSONField(default=list)

# class Done(models.Model):
#     url_extension = models.CharField(max_length=100)
#     api_obj = JSONField(default=list)
