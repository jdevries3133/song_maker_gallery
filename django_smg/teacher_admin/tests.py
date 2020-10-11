import json

from django.test import TestCase
from django.contrib.auth.models import User

from .models import Gallery


class GalleryConflictResolve(TestCase):
    def setUp(self):
        user = User.objects.create_user(
            'jack', 'jack@jack.com', 'jackpassword')
        for _ in range(20):
            with open('teacher_admin/sample_gallery.json', 'r') as jsn:
                obj = json.load(jsn)
                # remove screenshots from sample_gallery to simulate a new
                # gallery just sent from the frontend
                for gr in obj:
                    for i in gr[:-1]:
                        if len(i) >= 3:
                            del i[2]
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
            obj.api_obj = [[['this']]]
            obj.save()
            obj.refresh_from_db()
            new_url = obj.url_extension
            self.assertEqual(original_url, new_url)

    def test_placeholder_screenshots_were_assgined(self):
        PLACEHOLDER = (
            'https://song-maker-gallery.s3.amazonaws.com/manually_added'
            '/placeholder.png'
        )
        for gallery in self.get_queryset():
            for group in gallery.api_obj:
                for row in group[:-1]:
                    self.assertEqual(row[2], PLACEHOLDER)
