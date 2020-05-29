from rest_framework import permissions
from rest_framework.viewsets import ModelViewSet
from .serializers import GalleryAuthSerializer


class TeacherViewSet(ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]
    serializer_class = GalleryAuthSerializer

    def get_quereyset(self):
        return self.request.user.galleries.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)