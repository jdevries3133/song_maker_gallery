from django.contrib import admin
from .models import ToDo, Done

# Register your models here.
admin.site.register(ToDo)
admin.site.register(Done)