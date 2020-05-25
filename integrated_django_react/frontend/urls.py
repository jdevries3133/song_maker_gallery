from django.urls import path

from .views import index

urlpatterns = [
    path('', index),
    path('gallery/<str:gal_ext>/', index),
    path('signup/', index),
    path('login/', index),
    path('teacher/', index),
]