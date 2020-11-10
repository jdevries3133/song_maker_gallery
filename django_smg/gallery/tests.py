import json
from pathlib import Path

from django.test import TestCase
from django.contrib.auth.models import User

from .models import Gallery


class TestGalleryModel(TestCase):
    """
    Most importantly, the Gallery.generate_url_extension method should return
    a unique string that can be used as the url_extension of the gallery. This
    mechanism had been fraught with hacky workarounds, but the current
    implementation is concurrency unsafe.
    """
    def setUp(self):
        user = User.objects.create_user(
            'jack', 'jack@jack.com', 'jackpassword'
        )
        for _ in range(20):
            Gallery.objects.create(
                owner=user,
                title='Test Gallery Name',
                url_extension=Gallery.generate_url_extension('Test Gallery Name')
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
            obj.description = 'new description'
            obj.save()
            obj.refresh_from_db()
            new_url = obj.url_extension
            self.assertEqual(original_url, new_url)

    def test_conflicting_names_sequenced_correctly(self):
        """
        Galleries with overlapping names should append a number to the end
        of the gallery url_extension sequenetially.

        For example:

        - test-gallery-name
        - test-gallery-name1
        - test-gallery-name2
        etc...
        """
        sorted = self.get_queryset().order_by('created')
        for i, gallery in enumerate(sorted):
            continue
            if not i:  # no appended int yet
                self.assertEqual(gallery.url_extension, 'test-gallery-name')
                continue
            i = '-' + str(i)
            # convert i to str expected at end of url_extension
            self.assertEqual(gallery.url_extension[17:], str(i))
