import os
import logging
from random import randint
from requests import post
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from .serializers import GallerySerializer

logger = logging.getLogger(__name__)


class TeacherViewSet(ModelViewSet):
    """
    Viewset accessed by the teacher management page, for performing CRUD
    operations on galeries.
    """
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = GallerySerializer

    def get_queryset(self):
        return self.request.user.gallery.all()

    def perform_create(self, serializer):
        logger.debug(
            f'Requesting screenshots for the following galleries: {dir(serializer)}')
        gallery = serializer.save(owner=self.request.user)
        post_urls = [i + 'incoming/' for i in settings.SCREENSHOT_BOT_URLS]
        post(
            (
                # send request to random handling server
                post_urls[randint(0, (len(post_urls) - 1))]
            ),
            headers={
                'Authorization': f'Token {os.getenv("CUSTOM_AUTH_TOKEN")}'},
            data={'todo': JSONRenderer().render(
                self.get_serializer(gallery).data)}
        )

    def destroy(self, request, *args, **kwargs):
        try:
            to_delete = self.request.user.gallery.get(
                url_extension=request.data['url_extension'])
            serializer = self.get_serializer(to_delete)
            to_delete.delete()
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(data={'error': 'Gallery does not exist'})
