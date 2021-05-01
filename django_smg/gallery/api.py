import logging

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Gallery
from .serializers import GallerySerializer, GallerySummarySerializer

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
                many=True
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
            context={'user': request.user},
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
