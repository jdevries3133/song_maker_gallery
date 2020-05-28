from rest_framework import permissions
# from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from teacher_admin.models import Gallery
from .serializers import GalleryAuthSerializer

# temp
from django.contrib.auth.models import User

# @api_view(['POST'])
# @permission_classes((permissions.AllowAny,))
# def post(request):
#     print('event')
#     new_obj = Gallery.objects.create(
#         owner=User.objects.get(),
#         title=request.data['title'].strip(),
#         description=request.data['description'],
#         api_obj=request.data['api_obj'],
#     )
#     serializer = GalleryPostSerializer(new_obj, many=False)

#     return Response(serializer.data, status=status.HTTP_201_CREATED)

class TeacherViewSet(ModelViewSet):
    queryset = Gallery.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = GalleryAuthSerializer

    # def get_queryset(self):
    #     return '<h1>hello</h1>'

    # def perform_create(self, serializer):
    #     serializer.save(owner=self.request.user)

    # def list(self, request):
    #     quereyset = Gallery.objects.all()
    #     serializer = GalleryAuthSerializer
    #     return Response(serializer.data)