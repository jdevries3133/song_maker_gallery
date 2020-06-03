from rest_framework.serializers import ModelSerializer
from teacher_admin.models import Gallery

class GallerySerializer(ModelSerializer):
    class Meta:
        model = Gallery
        fields = ('url_extension', 'api_obj')

    