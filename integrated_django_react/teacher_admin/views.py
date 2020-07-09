import os
import logging
from requests import post
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from .serializers import GallerySerializer
from .models import Gallery

logger = logging.getLogger('file')

class TeacherViewSet(ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = GallerySerializer

    def get_queryset(self):
        return self.request.user.gallery.all()

    def perform_create(self, serializer):
        logger.debug(f'Requesting screenshots for the following galleries: {dir(serializer)}')
        gallery = serializer.save(owner=self.request.user)
        post_url = os.getenv('SCREENSHOT_BOT_URL') + 'incoming/'
        res = post(
            (
                os.getenv('SCREENSHOT_BOT_URL') + 'incoming/'
            ),
            headers={'Authorization': f'Token {os.getenv("CUSTOM_AUTH_TOKEN")}'},
            data={'todo': JSONRenderer().render(self.get_serializer(gallery).data)}
        )

    def destroy(self, request, *args, **kwargs):
        try: 
            to_delete = self.request.user.gallery.get(url_extension=request.data['url_extension'])
            serializer = self.get_serializer(to_delete)
            to_delete.delete()
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(data={'error': 'Gallery does not exist'})