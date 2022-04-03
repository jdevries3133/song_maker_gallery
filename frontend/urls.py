from django.urls import re_path
from django.shortcuts import render


def index(request, *_, **__):
    return render(request, "frontend/index.html")


urlpatterns = [
    re_path(r".*", index),
]
