from django.urls import path
from rest_framework import routers

from .api import (
    gallery,
    AuthGalleryViewset,
    PublicGalleryViewset,
    SongViewset,
    SongGroupViewset,
    instant_song_data,
    gallery_settings,
    StudentCreateSong,
)

urlpatterns = [
    path("", AuthGalleryViewset.as_view(), name="auth_gallery"),
    path("public/<slug:slug>/", PublicGalleryViewset.as_view(), name="public_gallery"),
    path("summary/<slug:slug>/", gallery, name="gallery"),
    path("song_data/", instant_song_data, name="instant_song_data"),
    path("settings/", gallery_settings, name="gallery_settings"),
    path("create_song/", StudentCreateSong.as_view(), name="student_create_song"),
]

router = routers.SimpleRouter()
router.register(r"song", SongViewset, "song")
router.register(r"song_group", SongGroupViewset, "song_group")
urlpatterns += router.urls
