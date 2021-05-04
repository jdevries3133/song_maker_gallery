from django.urls import path
from rest_framework import routers

from .api import (
    AuthGalleryViewset,
    PublicGalleryViewset,
    instant_song_data,
    SongViewset,
    SongGroupViewset
)

urlpatterns = [
    path('', AuthGalleryViewset.as_view(), name="auth_gallery"),
    path('public/<slug:slug>/', PublicGalleryViewset.as_view(), name="public_gallery"),
    path('song_data/', instant_song_data, name='instant_song_data'),
]

router = routers.SimpleRouter()
router.register(r'song', SongViewset, 'song')
router.register(r'song_group', SongGroupViewset, 'song_group')
urlpatterns += router.urls
