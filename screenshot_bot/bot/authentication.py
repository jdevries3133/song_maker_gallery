import os
from django.contrib.auth.models import User
from rest_framework.authentication import BaseAuthentication

class ScreenshotBotAuthentication(BaseAuthentication):
    def authenticate(self, request):
        token = request.META.get('HTTP_AUTHORIZATION')
        # breakpoint()
        if token == 'Token ' + os.getenv('CUSTOM_AUTH_TOKEN'):
            user = User.objects.get(username='jack')
            return (user, None)
        else:
            return None
        
