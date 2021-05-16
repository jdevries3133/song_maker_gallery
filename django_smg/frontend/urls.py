from django.conf.urls import url
from django.urls import path
from django.shortcuts import render

def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

urlpatterns = [
    url(r'.*', index),
]
