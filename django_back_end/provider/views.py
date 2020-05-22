from django.http import HttpResponse

from teacher.models import Gallery
from .serializers import PublicGallerySerializer

def public_gallery(request, public_id):
    queryset = Gallery.objects.filter(public_id=public_id)
    breakpoint()
