from django.urls import path
from django.shortcuts import render

def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

urlpatterns = [
    path('', index),
    path('gallery/<str:gal_ext>/', index),
    path('signup/', index),
    path('login/', index),
    path('teacher/', index),
    path('gallery-preview', index),
    path('privacy/', index),
    path('tos/', index),
]
