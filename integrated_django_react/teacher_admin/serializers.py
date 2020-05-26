from rest_framework.serializers import ModelSerializer
from .models import Gallery

class GalleryPostSerializer(ModelSerializer):
    class Meta:
        model = Gallery
        fields = [
            'url_extension',
            # num of screenshots in the queue
        ]
    