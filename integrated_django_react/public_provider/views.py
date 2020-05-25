from rest_framework import permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from teacher_admin.models import Gallery
from .serializers import PublicGallerySerializer

@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def gallery(request, gallery_name):
    gallery = Gallery.objects.get(url_extension=gallery_name)
    serializer = PublicGallerySerializer(gallery, many=False)
    return Response(serializer.data)