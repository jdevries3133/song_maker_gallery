import logging

from django.db.utils import IntegrityError
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Gallery, Song, SongGroup
from .serializers import GallerySerializer, GalleryDatasetSerializer

logger = logging.getLogger('file')


class AuthGalleryViewset(APIView):
    """
    Viewset accessed by the teacher management page, for performing CRUD
    operations on galeries.
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, *args, **kwargs):
        """
        Decompose the batch of data sent from the frontend and create a
        gallery with songs.
        """
        # catch depricated name "api_obj" renamed to songData
        if 'api_obj' in request.data:
            raise Exception('Use of depricated "api_obj"')
        serializer = GalleryDatasetSerializer(data=request.data, context={
            'user': request.user
        })
        serializer.is_valid(raise_exception=True)
        new_gallery = serializer.save()
        return Response(
            GallerySerializer(new_gallery).data,
            status=status.HTTP_201_CREATED
        )

    def get(self, request, *a, **kw):
        """
        Return all the galleries of an authenticated user.
        """
        # TODO: since this is an authenticated view, this should be where
        # the user's paginated galleries come from.
        return Response(
            GalleryDatasetSerializer().render(request.query_params.get('pk'))
        )

class PublicGalleryViewset(APIView):
    """
    Public viewset for rendering a single gallery
    """
    pass
