import logging

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Gallery
from .serializers import NaiveGallerySerializer, GalleryDatasetSerializer

logger = logging.getLogger(__name__)


class AuthGalleryViewset(APIView):
    """
    Viewset accessed by the teacher management page, for performing CRUD
    operations on galeries.
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]

    @ staticmethod
    def post(request):
        """
        Decompose the batch of data sent from the frontend and create a
        gallery with songs.
        """
        serializer = GalleryDatasetSerializer(data=request.data, context={
            'user': request.user
        })
        serializer.is_valid(raise_exception=True)
        return Response(NaiveGallerySerializer(serializer.save()).data)

    @ staticmethod
    def get(request):
        """
        Return all the galleries of an authenticated user.
        """
        return Response(
            NaiveGallerySerializer(
                request.user.gallery.all(),
                many=True
            ).data
        )

    @ staticmethod
    def delete(request):
        if not (slug_arg := request.query_params.get('pk')):
            return Response(
                {'message': 'Must include "slug" as a url paramater'},
                status=status.HTTP_400_BAD_REQUEST
            )
        for gallery_pk in slug_arg.split(','):
            Gallery.objects.filter(  # type: ignore
                id=gallery_pk,
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
        return Response(GalleryDatasetSerializer().render(slug=slug))
