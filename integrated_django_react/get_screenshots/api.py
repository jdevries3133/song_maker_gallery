import logging
from django.core.mail import send_mail
from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from teacher_admin.models import Gallery
from .authentication import ScreenshotBotAuthentication
from .serializers import GallerySerializer

logger = logging.getLogger('file')


class ScreenshotReturn(ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = GallerySerializer
    authentication_classes = (ScreenshotBotAuthentication,)
    queryset = Gallery.objects.all()

    def partial_update(self, request, *args, pk='url_extension', **kwargs):
        logger.debug('request info')
        logger.debug(request.META)
        logger.debug(request.data)
        instance = self.queryset.get(url_extension=request.data.get('pk'))
        serializer = GallerySerializer(
            instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # email confirmation that screenshots are ready
        subject = 'Your song maker gallery is ready to view!'
        message = (
            f'Hello {instance.owner.username}!\n\nYour gallery at https://songmakergallery.com/gallery/{instance.url_extension}/ is ready '
            'and currently displaying student work!\n\nUnsubscribe? https://forms.gle/mqCcbxmQn3JfeNp76'
        )
        from_email = 'songmakergallery@gmail.com'
        recipient_list = [instance.owner.email]
        try:
            send_mail(
                subject,
                message,
                from_email,
                recipient_list
            )
        except Exception as err:
            logger.error(
                f'Post screenshot notification email failed due to {err}'
            )
            return Response(status=500)

        return Response(data=serializer.data)
