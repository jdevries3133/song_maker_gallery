from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAdminUser
from .authentication import ScreenshotBotAuthentication
from .models import ToDo, Done

@api_view(['POST'])
@authentication_classes((ScreenshotBotAuthentication,))
def incoming(request, *args, **kwargs):
    return HttpResponse(
        request.data,
        {'message': 'recieved'})
