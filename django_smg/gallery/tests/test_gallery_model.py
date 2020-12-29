import json
from pathlib import Path

from django import test
from django.contrib.auth.models import User

from ..models import Gallery


class TestGalleryModel(test.TestCase):
    """
    Most importantly, the Gallery.generate_slug method should return
    a unique string that can be used as the slug of the gallery. This
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
                slug=Gallery.generate_slug('Test Gallery Name')
            )

    def get_queryset(self):
        return Gallery.objects.all()

    def test_url_naming_conflict_avoidance(self):
        for obj in self.get_queryset():
            self.assertEqual(obj.slug[:17], 'test-gallery-name')

    def test_url_does_not_mutate_on_update(self):
        for obj in self.get_queryset():
            # check that the url does not change on update
            original_url = obj.slug
            obj.description = 'new description'
            obj.save()
            obj.refresh_from_db()
            new_url = obj.slug
            self.assertEqual(original_url, new_url)

    def test_conflicting_names_sequenced_correctly(self):
        """
        Galleries with overlapping names should append a number to the end
        of the gallery slug sequenetially.

        For example:

        - test-gallery-name
        - test-gallery-name1
        - test-gallery-name2
        etc...
        """
        sorted_ = self.get_queryset().order_by('created')
        for i, gallery in enumerate(sorted_):
            if not i:  # no appended int yet
                self.assertEqual(gallery.slug, 'test-gallery-name')
                continue
            i = '-' + str(i)
            # convert i to str expected at end of slug
            self.assertEqual(gallery.slug[17:], str(i))

