from django.http import HttpResponse
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser
from .authentication import ScreenshotBotAuthentication
from .take_screenshots import ScreenshotTaker


class ResponseAndLaunch(HttpResponse):
    def __init__(self, launch_gallery, content=b'', *args, **kwargs):
        super().__init__(content, *args, **kwargs)
        self.launch_gallery = launch_gallery

    def close(self):
        super(ResponseAndLaunch, self).close()
        screenshotter = ScreenshotTaker(self.launch_gallery)
        screenshotter.launch_gallery()
        


@api_view(['POST'])
@authentication_classes((ScreenshotBotAuthentication,))
def incoming(request, *args, **kwargs):
    return ResponseAndLaunch(
        request.data,               # see subclass above; self.launch_gallery
        {'message': 'recieved'})    # content of the response
