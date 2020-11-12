from django.urls import path

from .api import AuthGalleryViewset, PublicGalleryViewset

urlpatterns = [
    path('<slug:slug>/', AuthGalleryViewset.as_view(), name="gallery"),
]
