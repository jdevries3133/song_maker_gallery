from copy import copy
import logging
from types import SimpleNamespace

from rest_framework import permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import Gallery, SongGroup
from .serializers import (
    GallerySerializer,
    GallerySummarySerializer,
    GalleryUpdateSerializer,
    SongGroupSerializer,
    SongSerializer,
)
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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @ staticmethod
    def patch(request):
        gal = Gallery.objects.get(pk=request.data.get('pk'))
        serializer = GalleryUpdateSerializer(
            gal,
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @ staticmethod
    def delete(request):
        if not (pks := request.query_params.get('pk')):
            return Response(
                {'message': 'Must include "pk" as a url paramater'},
                status=status.HTTP_400_BAD_REQUEST
            )
        for gallery_pk in pks.split(','):
            try:
                Gallery.objects.get(  # type: ignore
                    pk=gallery_pk,
                    owner=request.user
                ).delete()
            except Gallery.DoesNotExist:
                return Response(
                    {'pk': f'Gallery with a pk of {gallery_pk} was not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response({'message': 'deleted'})


class PublicGalleryViewset(APIView):
    """
    Public viewset for rendering a single gallery
    """

    permission_classes = [permissions.AllowAny]

    @ staticmethod
    def get(_, slug):
        try:
            instance = Gallery.objects.get(slug=slug)
        except Gallery.DoesNotExist:  # type: ignore
            return Response({'slug': slug}, status=status.HTTP_404_NOT_FOUND)
        return Response(GallerySerializer(instance).data)


@ api_view(['POST'])
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
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ api_view(['PATCH'])
@ permission_classes([permissions.IsAuthenticated])
def gallery_settings(request):
    """
    User can provide updates one setting at a time.
    """
    try:
        gal = Gallery.objects.get(slug=request.data.pop('slug'),
                                  owner=request.user)
    except Gallery.DoesNotExist:
        return Response({'message': 'Gallery not found'},
                        status=status.HTTP_404_NOT_FOUND)
    serializer = GallerySummarySerializer(gal, data=request.data,
                                          context={'request': request},
                                          partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentCreateSong(APIView):
    """
    Views that allow a student to upload their own song.
    get: lists groups in the gallery for them to choose from
    post: submit the song
    """

    permission_classes = (permissions.AllowAny,)

    @ staticmethod
    def get(request):
        """
        List groups in gallery (via query param).
        """
        try:
            if pk := (request.query_params.get('pk')):
                gal = Gallery.objects.get(pk=pk)
            elif slug := (request.query_params.get('slug')):
                gal = Gallery.objects.get(slug=slug)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        except Gallery.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(SongGroupSerializer(gal.song_groups, many=True).data)

    @ staticmethod
    def post(request):
        """
        Create a gallery
        """
        try:
            group = SongGroup.objects.get(pk=request.data.get('group_pk'))
        except SongGroup.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not group.gallery.is_editable:
            return Response({'error': 'Gallery is not editable'},
                            status=status.HTTP_400_BAD_REQUEST)

        new_song = copy(request.data)
        new_song['group'] = group.pk
        new_song['gallery'] = group.gallery
        serializer = SongSerializer(
            data=new_song,
            context={'request': SimpleNamespace(user=group.owner)}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



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

