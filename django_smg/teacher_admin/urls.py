from django.urls import path

from .api import GalleryViewSet

urlpatterns = [
    path('gallery/', GalleryViewSet.as_view(), name="gallery")
]
