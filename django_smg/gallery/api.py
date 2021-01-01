import logging

from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Gallery
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

    def post(self, request):
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
        return Response(
            serializer.render(serializer.save().slug),
            status=status.HTTP_201_CREATED
        )

    def get(self, request):
        """
        Return all the galleries of an authenticated user.
        """
        # TODO: since this is an authenticated view, this should be where
        # the user's paginated galleries come from.
        return Response(GalleryDatasetSerializer(
            context={'user': request.user}
        ).render_many())

    def delete(self, request):
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

    def get(self, request, slug):
        return Response(GalleryDatasetSerializer().render(slug=slug))
