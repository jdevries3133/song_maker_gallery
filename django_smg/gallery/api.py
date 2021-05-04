import logging
from types import SimpleNamespace
from typing import Iterable

from rest_framework import permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import Gallery, Song
from .serializers import GallerySerializer, GallerySummarySerializer, SongGroupSerializer, SongSerializer
from .services import fetch_and_cache

logger = logging.getLogger(__name__)


class AuthGalleryViewset(APIView):
    """
    For performing create / read / delete operations on whole galleries at
    a time, such as when uploading data from a spreadsheet.
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    @ staticmethod
    def get(request):
        """
        Return all the galleries of an authenticated user.
        """
        return Response(
            GallerySummarySerializer(
                request.user.galleries.all(),
                many=True,
                context={'request': request}
            ).data
        )

    @ staticmethod
    def post(request):
        """
        Decompose the batch of data sent from the frontend and create a
        gallery with songs and groups.
        """
        serializer = GallerySerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            instance = serializer.save()
            return Response(
                GallerySummarySerializer(instance).data,
                status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


    @ staticmethod
    def delete(request):
        if not (pks := request.query_params.get('pk')):
            return Response(
                {'message': 'Must include "pk" as a url paramater'},
                status=status.HTTP_400_BAD_REQUEST
            )
        for gallery_pk in pks.split(','):
            Gallery.objects.get(  # type: ignore
                pk=gallery_pk,
                owner=request.user
            ).delete()
        return Response({'message': 'deleted'})


class PublicGalleryViewset(APIView):
    """
    Public viewset for rendering a single gallery
    """

    permission_classes = [permissions.AllowAny]

    @ staticmethod
    def get(_, slug):
        instance = Gallery.objects.get(slug=slug)
        return Response(GallerySerializer(instance).data)


@ api_view(['POST'])
@ permission_classes([permissions.IsAuthenticated])
def instant_song_data(request):
    """
    Provide instant song data for a list of song objects.
    """
    serializer = SongSerializer(
        data=request.data,
        context={'request': request}
    )
    if serializer.is_valid():
        song = serializer.save()
        song = fetch_and_cache(songs=[song])[0]  # type: ignore
        return Response(serializer.data, status.HTTP_201_CREATED)


class SongViewset(viewsets.ModelViewSet):

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SongSerializer

    def get_queryset(self):
        return self.request.user.songs.all()  # type: ignore


class SongGroupViewset(viewsets.ModelViewSet):

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SongGroupSerializer

    def get_queryset(self):
        return self.request.user.song_groups.all()  # type: ignore

