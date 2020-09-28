from rest_framework.serializers import ModelSerializer
from teacher_admin.models import Gallery

class PublicGallerySerializer(ModelSerializer):
  class Meta:
    model = Gallery
    fields = ['title', 'description', 'api_obj']