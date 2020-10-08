import json

from django.test import TestCase
from django.contrib.auth.models import User

from .models import Gallery


class GalleryConflictResolve(TestCase):
    def setUp(self):
        user = User.objects.create_user(
            'jack', 'jack@jack.com', 'jackpassword')
        for _ in range(100):
            with open('teacher_admin/sample_gallery.json', 'r') as jsn:
                obj = json.load(jsn)
            Gallery.objects.create(
                owner=user,
                title='Test gallery Name',
                api_obj=obj,
            )

    def get_queryset(self):
        return Gallery.objects.all()

    def test_url_naming_conflict_avoidance(self):
        for obj in self.get_queryset():
            self.assertEqual(obj.url_extension[:17], 'test-gallery-name')

    def test_url_does_not_mutate_on_update(self):
        for obj in self.get_queryset():
            # check that the url does not change on update
            original_url = obj.url_extension
            obj.api_obj = ['this']
            obj.save()
            obj.refresh_from_db()
            new_url = obj.url_extension
            self.assertEqual(original_url, new_url)
