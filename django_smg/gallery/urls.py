from django.urls import path

from .api import GalleryViewSet

urlpatterns = [
    path('', GalleryViewSet.as_view(), name="gallery"),
]
