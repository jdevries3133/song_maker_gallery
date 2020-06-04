import os
import json
from rest_framework import permissions
from rest_framework import status
from django_cron import CronJobBase, Schedule
from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from teacher_admin.models import Gallery
from requests import post
from .authentication import ScreenshotBotAuthentication
from .serializers import GallerySerializer

class ScreenshotCron(CronJobBase):
    """
    Don't forget to start the chron on the system in the terminal.
    """
    RUN_EVERY_MINS = 60
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'get_screenshots.cron'

    def do(self):
        galleries_todo = Gallery.objects.all().filter(needs_screenshot=True).order_by('created')
        serializer = GallerySerializer(galleries_todo, many=True)
        res = post(
            'http://localhost:8000/incoming/',
            headers={'Authorization': f'Token {os.getenv("CUSTOM_AUTH_TOKEN")}'},
            data={'todo': JSONRenderer().render(serializer.data)}
        )

class ScreenshotReturn(ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = GallerySerializer
    authentication_classes = (ScreenshotBotAuthentication,)
    queryset = Gallery.objects.all()

    def partial_update(self, request, pk='url_extension', *args, **kwargs):
        instance = self.queryset.get(url_extension=request.data.get('pk'))
        serializer = GallerySerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(custom_overwrite=True)  # jankiness to the extreme :(
        return Response(data=serializer.data)
