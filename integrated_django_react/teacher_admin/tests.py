import uuid

from django.test import TestCase

from .models import Gallery

class GalleryConflictResolve(TestCase):
    def setUp(self):
        pass

    def test_conflict_avoidance(self):
        gal_name = uuid.uuid1()
        print('test run')
        for i in range(100):
            Gallery.objects.create(
                owner='jack',
                title=gal_name,
                api_obj=['li'],
            )




