from django.core.exceptions import ObjectDoesNotExist
from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .serializers import GalleryAuthSerializer
from .models import Gallery


class TeacherViewSet(ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = GalleryAuthSerializer

    def get_queryset(self):
        return self.request.user.gallery.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        try: 
            to_delete = self.request.user.gallery.get(url_extension=request.data['url_extension'])
            serializer = self.get_serializer(to_delete)
            to_delete.delete()
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(data={'error': 'Gallery does not exist'})