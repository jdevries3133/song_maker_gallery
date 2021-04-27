import csv
from pathlib import Path
import json
from typing import Generator, Iterable, Union
from unittest.mock import patch

from django import test
from django.test.utils import CaptureQueriesContext
from django.db import connection
from django.contrib.auth.models import User
from django.conf import settings
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework import serializers

from .base_case import GalleryTestCase, patch_fetch_and_cache
from ..serializers import GalleryDatasetSerializer, GallerySerializer
from ..models import Gallery, SongGroup, Song
from ..services import mock_data as default_api_return_data


class TestGallerDatasetSerializer(GalleryTestCase):
    """
    Gallery serializer handles normalizing bulk create request into models,
    and rendering gallery views from the database.
    """

    def setUp(self ):
        super().setUp()
        self._login_client()
        self.add_gallery()

    def test_gallery_single_gallery_exists(self):
        gallery_set = Gallery.objects.filter(title='Test Title')  # type: ignore
        self.assertEqual(len(gallery_set), 1)

    def test_gallery_title_and_description(self):
        gallery = Gallery.objects.get(slug='test-title')  # type: ignore
        self.assertEqual(gallery.title, self.mock_api_data['title'])
        self.assertEqual(
            gallery.description,
            self.mock_api_data['description']
        )

    def test_correct_number_of_Song_objects_are_created(self):
        """
        One Song created for each link in the group.
        """
        songs = Song.objects.all()  # type: ignore
        self.assertEqual(
            len(songs),
            8
        )

    def test_correct_number_of_SongGroup_objects_are_created(self):
        """
        Bulk create action perfoemed in self.setUp should create SongGroup
        objects to store each of the groupings of songs.
        """
        song_groups = SongGroup.objects.all()  # type: ignore
        self.assertEqual(
            len(song_groups),
            2
        )

    def test_names_properly_processed(self):
        """
        All student names in the first group should be coerced into "Mark J.",
        and all student names in the second group shouldbe coerced into
        "Lilly G."
        """

        # TODO: move to a test on the song serializer.
        for song in Song.objects.all():  # type: ignore
            self.assertIn(
                song.student_name,
                [
                    'Mark J.',
                    'Lilly G.'
                ]
            )
            self.assertEqual(song.songId, '5676759593254912')

    def test_songId_normalization(self):
        """
        # TODO: implement and put in services test suite
        """

    def test_songId_validation(self):
        """
        # TODO: implement and put in Song serializer test suite
        """

    @ patch_fetch_and_cache
    def test_gallery_serializer_render_method(self):
        """
        Render method makes a complex query and renders the data for the
        frontend to render a single gallery.
        """
        rendered = GallerySerializer(Gallery.objects.get(slug='test-title')).data
        self.assertEqual(
            self.expected_rendered_data,
            rendered
        )

    @ patch_fetch_and_cache
    def test_render_method_num_queries(self):
        GalleryDatasetSerializer().render('test-title')
        with self.assertNumQueries(4):
            GalleryDatasetSerializer().render('test-title')

    def test_duplicate_group_names_are_invalid(self):
        song_data = [
            {
                'group_name': 'duplicate',
                'songs': []
            },
            {
                'group_name': 'duplicate',
                'songs': []
            }
        ]
        data = self.mock_api_data
        data['song_groups'] = song_data
        serializer = GallerySerializer(data=data)
        # breakpoint()
        # self.assertFalse(serializer.is_valid())



class TestQueryCountLargeGallery(test.TestCase):

    def setUp(self):
        self.user = User.objects.create_user(  # type: ignore
            username='jack',
            email='jack@jack.com',
            password='ghjlesdfr;aghruiao;'
        )
        with open(
            Path(Path(__file__).parent,
                 'mock_data',
                 'gallery_post_request_data_example.json'
            ), 'r'
        ) as jsn:
            data = json.load(jsn)
        self.serializer = GalleryDatasetSerializer(data=data, context={
            'user': self.user,
        })
        self.serializer.is_valid()

    def test_num_queries_on_create(self):
        """
        For a large gallery.
        """
        with CaptureQueriesContext(connection) as query_count:
            self.serializer.save()
        self.assertLess(query_count.final_queries, 15)

    def test_num_queries_on_get_queryset(self):
        self.serializer.save()
        with self.assertNumQueries(1):
            GalleryDatasetSerializer().get_queryset(slug='sample-gallery')

    @ patch_fetch_and_cache
    def test_num_queries_on_initial_render(self):
        """
        num_queries = num_songs + 2
        """
        self.serializer.save()
        with CaptureQueriesContext(connection) as query_count:
            self.serializer.render(slug='sample-gallery')
        self.assertEqual(query_count.final_queries, 8)

    @ patch_fetch_and_cache
    def test_num_queries_on_cached_render(self):
        """
        After caching has occuried, the .render() method will be less
        costly.
        """
        self.serializer.save()
        self.serializer.render(slug='sample-gallery')
        with CaptureQueriesContext(connection) as query_count:
            self.serializer.render(slug='sample-gallery')
        self.assertLess(query_count.final_queries, 10)

class TestSongDataValidatorMessages(test.TestCase):

    UI_TEST_DATA_DIR = Path(Path(__file__).parent, 'mock_data')

    @ staticmethod
    def _make_song_data(rows: list) -> list:
        """
        Append a group name to the rows, which is the data structure for
        storing the group name.
        """
        rows.append('Test Group')
        return [rows]

    def test_validator_message_for_empty_link(self):
        with open(Path(self.UI_TEST_DATA_DIR, 'empty_link.csv'), 'r') as csvf:
            rows = [r for r in csv.reader(csvf)][1:]
        with self.assertRaisesMessage(serializers.ValidationError, 'Row #3'):
            GalleryDatasetSerializer.validate_songData(
                self._make_song_data(rows)
            )
        with self.assertRaisesMessage(serializers.ValidationError, 'Jamir'):
            GalleryDatasetSerializer.validate_songData(
                self._make_song_data(rows)
            )

    def test_validator_message_for_empty_name(self):
        with open(Path(self.UI_TEST_DATA_DIR, 'empty_name.csv'), 'r') as csvf:
            rows = [r for r in csv.reader(csvf)][1:]
        with self.assertRaisesMessage(serializers.ValidationError, '"Test Group,"'):
            GalleryDatasetSerializer.validate_songData(
                self._make_song_data(rows)
            )
        with self.assertRaisesMessage(
                serializers.ValidationError,
                'https://musiclab.chromeexperiments.com/Song-Maker/song/'
                '4914262951591936'
        ):
            GalleryDatasetSerializer.validate_songData(
                self._make_song_data(rows)
            )

    def test_validator_message_for_empty_row(self):
        with open(Path(self.UI_TEST_DATA_DIR, 'empty_row.csv'), 'r') as csvf:
            rows = [r for r in csv.reader(csvf)][1:]
        with self.assertRaisesMessage(
            serializers.ValidationError,
            '"Test Group," row 3 is empty'
        ):
            GalleryDatasetSerializer.validate_songData(
                self._make_song_data(rows)
            )

    def test_validator_message_for_invalid_link(self):
        invalid_link_files = [
            Path(self.UI_TEST_DATA_DIR, f'invalid_link_{n}.csv')
            for n in range(1, 5)
        ]
        for p in invalid_link_files:
            with open(p, 'r') as csvf:
                rows = [r for r in csv.reader(csvf)][1:]
            expect = (
            )
            with self.assertRaisesMessage(
                serializers.ValidationError,
                f'The Song Maker link for Jamir ({rows[2][1]}) is not valid.'
            ):
                GalleryDatasetSerializer.validate_songData(
                    self._make_song_data(rows)
                )


class TestGallerySerializer(TestCase):

    def test_simple_usage(self):
        serializer = GallerySerializer(data={
            'title': 'My Gallery',
            'description': 'My gallery description.',
            'song_groups': [
                {
                    'group_name': 'Larry\'s Homeroom',
                    'songs': [
                        {
                            'songId': '1234123412341234',
                            'student_name': 'Chris J.'
                        }
                    ]
                }
            ]
        })
        self.assertTrue(serializer.is_valid())
        instance = serializer.save()

        # Gallery
        self.assertEqual(instance.title, 'My Gallery')                      # type: ignore
        self.assertEqual(instance.description, 'My gallery description.')   # type: ignore
        self.assertEqual(instance.slug, 'my-gallery')                       # type: ignore

        # Song group
        self.assertEqual(
            instance.song_groups.first().group_name,                        # type: ignore
            'Larry\'s Homeroom'
        )
        self.assertEqual(len(instance.song_groups.all()), 1)                # type: ignore

        # Song
        self.assertEqual(len(instance.songs.all()), 1)                      # type: ignore
        self.assertEqual(instance.songs.first().student_name, 'Chris J.')   # type: ignore
        self.assertEqual(instance.songs.first().songId, '1234123412341234') # type: ignore
