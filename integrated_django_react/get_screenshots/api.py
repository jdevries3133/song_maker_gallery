import os
from rest_framework import permissions
from django_cron import CronJobBase, Schedule
from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from teacher_admin.models import Gallery
from requests import post
from .authentication import ScreenshotBotAuthentication
from .serializers import GallerySerializer

class ScreenshotCron(CronJobBase):
    RUN_EVERY_MINS = .01
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'get_screenshots.cron'
    def do(self):
        print('done')
        post(
            'http://localhost:8000/incoming',
            headers={'Authorization': f'Token {os.getenv("CUSTOM_AUTH_TOKEN")}'}, 
            data={'todo': Gallery.objects.all().filter(needs_screenshot=True).order_by('created')[:30]}
        )

class ScreenshotReturn(ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = GallerySerializer
    authentication_classes = (ScreenshotBotAuthentication,)
    queryset = Gallery.objects.all()

    def update(self, request):
        # write this when the screenshot bot is actually doing something
        print(request.data)
        return Response({
            'message': 'Updated'
        })

    def get_queryset(self):
        return self.queryset.all().filter(needs_screenshot=True).order_by('created')[:30]