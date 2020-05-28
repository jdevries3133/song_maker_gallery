from rest_framework.serializers import ModelSerializer
from .models import Gallery

class GalleryAuthSerializer(ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'

    