from django.urls import path

from .api import GalleryViewSet

urlpatterns = [
    path('<slug:slug>/', GalleryViewSet.as_view(), name="gallery"),
]
