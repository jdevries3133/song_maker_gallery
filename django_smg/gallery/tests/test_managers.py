import string
import random
from unittest.mock import patch

from django.contrib.auth.models import User
from django.db import models
from django.test import TransactionTestCase

from ..models import Gallery, Song, SongGroup
from ..managers import OrderManager, SlugCreationFailed, SlugManager

class Base(TransactionTestCase):

    def setUp(self):
        self.user = User.objects.create(                        # type: ignore
            username='testuser',
            password='testpass',
        )
        self.gallery = Gallery.objects.create(                  # type: ignore
            owner=self.user,
            title='Test Gallery',
            description='Test description is here.',
        )
        self.group = SongGroup.objects.create(                  # type: ignore
            group_name='Test Group',
            owner=self.user,
            gallery=self.gallery
        )
        self.songs = [
            Song.objects.create(
                songId=f'{i}',
                owner=self.user,
                student_name=n,
                gallery=self.gallery,
                group=self.group
            )
            for i, n in enumerate(('Sally', 'Chris', 'Tom'))
        ]


class TestOrderManager(Base):

    def test_default_order_assignment(self):
        self.assertEqual(self.songs[0].order, 0)
        self.assertEqual(self.songs[1].order, 1)
        self.assertEqual(self.songs[2].order, 2)

    def test_order_can_be_manually_assigned(self):
        obj = Song.objects.create(
            songId=10,
            owner=self.user,
            student_name='Jake',
            gallery=self.gallery,
            group=self.group,
            order=3
        )
        self.assertEqual(obj.order, 3)

    def test_high_order_normalized(self):
        obj = Song.objects.create(
            songId=10,
            owner=self.user,
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

    def test_bulk_create(self):
        """
        The big trick here is that if you throw in a jumble of random objects,
        the bulk create method should separate them out into groups based on
        the foreign_field primary key, then order them within the group only.
        """
        other_group = SongGroup.objects.create(
            gallery=self.gallery,
            owner=self.user,
            group_name='Second Group',
        )
        songs = [
            # songs in original group (self.group)
            Song(
                group=self.group,
                gallery=self.gallery,
                owner=self.user,
                student_name=str(i),  # later, this shows if original order was maintained
                songId='1234123412341234'
            ) for i in range(10)
        ] + [
            # songs in the new group created first
            Song(
                group=other_group,
                gallery=self.gallery,
                owner=self.user,
                student_name=str(i),  # later, this shows if original order was maintained
                songId='1234123412341234'
            ) for i in range(10)
        ]
        result = Song.objects.bulk_create(songs)

        # filter the results back out
        grp1 = sorted([r for r in result if r.group.pk == self.group.pk], key=lambda i: i.order)
        grp2 = sorted([r for r in result if r.group.pk == other_group.pk], key=lambda i: i.order)

        self.assertEqual(len(grp1), 10)
        self.assertEqual(len(grp2), 10)

        for index, song in enumerate(grp1):
            self.assertEqual(song.group, self.group)
            self.assertEqual(song.order, index)
            # shows that order of the input list matches the order value
            # assignment
            self.assertEqual(int(song.student_name), index)
        for index, song in enumerate(grp2):
            self.assertEqual(song.group, other_group)
            self.assertEqual(song.order, index)
            # shows that order of the input list matches the order value
            # assignment
            self.assertEqual(int(song.student_name), index)


class TestSlugManager(Base):

    def setUp(self):
        self.user = User.objects.create_user(  # type: ignore
            'jack', 'jack@jack.com', 'jackpassword'
        )
        self.galleries = [
            Gallery.objects.create(
                owner=self.user,
                title='Test Gallery Name',
            )
            for _ in range(20)
        ]

    def get_queryset(self):
        return Gallery.objects.all()  # type: ignore

    def test_slug_created(self):
        self.assertEqual(self.galleries[0].slug, 'test-gallery-name')


    def test_slug_naming_conflict_avoidance(self):
        for obj in self.get_queryset():
            self.assertEqual(obj.slug[:17], 'test-gallery-name')

    def test_slug_does_not_mutate_on_update(self):
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

    def test_slugify_long_title(self):
        """
        Slug strings can be any length. The slugify method should chop them
        of after 40 characters.
        """
        gal = Gallery.objects.create(  # type: ignore
            owner=self.user,
            title=('Test Gallery Name' * 5),
        )
        self.assertEqual(
            gal.slug,
            'test-gallery-nametest-gallery-nametest-g'
        )

    @ patch.object(SlugManager, 'generate_slug')
    @ patch('gallery.managers.logger')
    def test_integrity_error_handled(self, mock_log, mock_slug):
        """
        Handle by logging and aborting by raising exception.
        """
        mock_slug.return_value = 'always_same_slug'
        gal = Gallery.objects.create(owner=self.user, title="", description="")
        self.assertEqual(gal.slug, 'always_same_slug')
        with self.assertRaises(SlugCreationFailed):
            gal1 = Gallery.objects.create(owner=self.user, title="", description="")
            mock_log.exception.assert_called()
