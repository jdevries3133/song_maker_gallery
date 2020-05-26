from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from teacher_admin.models import Gallery
from .serializers import GalleryPostSerializer

@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def post(request):
    new_obj = Gallery.objects.create(
        owner=request.user,
        title=request.data['title'].strip(),
        description=request.data['description'],
        api_obj=request.data['api_obj'],
    )
    print(dir(new_obj))
    serializer = GalleryPostSerializer(new_obj, many=False)

    return Response(serializer.data, status=status.HTTP_201_CREATED)