from django.urls import path

from .api import AuthGalleryViewset, PublicGalleryViewset, instant_song_data

urlpatterns = [
    path('', AuthGalleryViewset.as_view(), name="auth_gallery"),
    path('public/<slug:slug>/', PublicGalleryViewset.as_view(), name="public_gallery"),
    path('song_data/', instant_song_data, name='instant_song_data')
]
