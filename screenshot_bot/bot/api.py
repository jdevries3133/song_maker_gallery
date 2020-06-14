import logging
import json
import io
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_429_TOO_MANY_REQUESTS
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import JSONParser
from .authentication import ScreenshotBotAuthentication
from .models import ToDo

logger = logging.getLogger('file')

@api_view(['POST'])
@authentication_classes((ScreenshotBotAuthentication,))
def incoming(request, *args, **kwargs):
    logger.debug('OBJECTS PRESENT UPON REQUEST')
    logger.debug(not ToDo.objects.all())
    if ToDo.objects.all():
        return Response(
            {'message': 'currently processing screenshots'},
            status=HTTP_429_TOO_MANY_REQUESTS,
        )
    stream = io.BytesIO(request.data['todo'].encode('utf-8'))
    data = JSONParser().parse(stream)
    for gallery in data:
        ToDo.objects.create(url_extension=gallery['url_extension'], api_obj=gallery['api_obj'])

    # serializer
    return HttpResponse(
        request.data,
        {'message': 'recieved'})
