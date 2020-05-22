import uuid

from django.test import TestCase
from django.contrib.auth.models import User

from .models import Gallery

class GalleryConflictResolve(TestCase):
    def setUp(self):
        user = User.objects.create_user('jack', 'jack@jack.com', 'jackpassword')
        for i in range(100):
            Gallery.objects.create(
                owner=user,
                title='Test gallery Name',
                api_obj=['li'],
            )

    def test_conflict_avoidance(self):
        objs = Gallery.objects.all()
        for obj in objs:
            self.assertEqual(obj.url_extension[:17], 'test-gallery-name')