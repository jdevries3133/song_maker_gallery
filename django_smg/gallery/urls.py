from django.urls import path

from .api import AuthGalleryViewset, PublicGalleryViewset

urlpatterns = [
    path('', AuthGalleryViewset.as_view(), name="auth_gallery"),
    path('public/<slug:slug>/', PublicGalleryViewset.as_view(), name="public_gallery")
]
