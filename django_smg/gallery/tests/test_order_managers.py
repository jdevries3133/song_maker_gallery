from django.contrib.auth.models import User
from django.db import models
from django.test import TestCase

from ..models import Gallery, Song, SongGroup
from ..order_managers import OrderManager


class TestOrderManager(TestCase):

    def setUp(self):
        self.user = User.objects.create(                        # type: ignore
            username='testuser',
            password='testpass',
        )
        self.gallery = Gallery.objects.create(                  # type: ignore
            owner=self.user,
            title='Test Gallery',
            description='Test description is here.',
            slug='test-gallery'
        )
        self.group = SongGroup.objects.create(                  # type: ignore
            group_name='Test Group',
            gallery=self.gallery
        )
        self.songs = [
            Song.objects.create(
                songId=f'{i}',
                student_name=n,
                gallery=self.gallery,
                group=self.group
            )
            for i, n in enumerate(('Sally', 'Chris', 'Tom'))
        ]

    def test_default_order_assignment(self):
        self.assertEqual(self.songs[0].order, 0)
        self.assertEqual(self.songs[1].order, 1)
        self.assertEqual(self.songs[2].order, 2)

    def test_order_can_be_manually_assigned(self):
        obj = Song.objects.create(
            songId=10,
            student_name='Jake',
            gallery=self.gallery,
            group=self.group,
            order=3
        )
        self.assertEqual(obj.order, 3)

    def test_high_order_normalized(self):
        obj = Song.objects.create(
            songId=10,
            student_name='Jake',
            gallery=self.gallery,
            group=self.group,

            # order of 10 is brought down to three because that is the next
            # natural order
            order=10
        )
        self.assertEqual(obj.order, 3)

    def test_move_end_to_start(self):
        Song.objects.move(self.songs[2], 0)

        # last song shited back into position 0
        self.assertEqual(self.songs[2].order, 0)

        # other songs were shifted to the right
        [s.refresh_from_db() for s in self.songs]
        self.assertEqual(self.songs[0].order, 1)
        self.assertEqual(self.songs[1].order, 2)

    def test_move_start_to_end(self):
        Song.objects.move(self.songs[0], 2)

        # first song shited forward into position 2
        self.assertEqual(self.songs[0].order, 2)

        # other songs were shifted to the left
        [s.refresh_from_db() for s in self.songs]
        self.assertEqual(self.songs[1].order, 0)
        self.assertEqual(self.songs[2].order, 1)
