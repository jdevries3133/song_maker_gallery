from rest_framework import serializers
from teacher_admin.models import Gallery

class PublicGallerySerializer(serializers.ModelSerializer):
  class Meta:
    model = Gallery
    fields = ['title', 'description', 'api_obj']