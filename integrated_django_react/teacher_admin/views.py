from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from .serializers import GalleryAuthSerializer


class TeacherViewSet(ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = GalleryAuthSerializer

    def get_queryset(self):
        return self.request.user.gallery.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)