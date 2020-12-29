from django.urls import path

from .api import AuthGalleryViewset, PublicGalleryViewset

urlpatterns = [
    path('', AuthGalleryViewset.as_view(), name="gallery"),
]
