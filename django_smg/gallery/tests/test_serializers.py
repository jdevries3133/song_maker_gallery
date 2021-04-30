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
from rest_framework.exceptions import ErrorDetail

from .base_case import GalleryTestCase, patch_fetch_and_cache
from ..serializers import GallerySerializer
from ..models import Gallery, SongGroup, Song
from ..services import mock_data as default_api_return_data


class TestGallerySerializer(GalleryTestCase):
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
        for song in Song.objects.all():  # type: ignore
            self.assertIn(
                song.student_name,
                [
                    'Mark J.',
                    'Lilly G.'
                ]
            )
            self.assertEqual(song.songId, '5676759593254912')

    @ patch_fetch_and_cache
    def test_gallery_serializer_render_method(self):
        rendered = GallerySerializer(Gallery.objects.get(slug='test-title')).data
        self.assertEqual(
            self.expected_rendered_data,
            rendered
        )

    @ patch_fetch_and_cache
    def test_render_method_num_queries(self):
        self.add_gallery()
        with self.assertNumQueries(8):
            instance = Gallery.objects.get(slug='test-title')
            GallerySerializer(instance).data

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
        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors.get('song_groups')[0],
            'Group names must be unique. The name duplicate was repeated'
        )

    def test_validator_message_for_empty_link(self):
        data = self.mock_api_data
        try:
            data['song_groups'][0]['songs'][0]['songId'] = ''  # type: ignore
        except LookupError:  # aka KeyError or IndexError
            self.fail('Lookup error in test setup')
        serializer = GallerySerializer(data=data)
        self.assertFalse(serializer.is_valid())

    def test_validator_message_for_empty_name(self):
        data = self.mock_api_data
        try:
            data['song_groups'][0]['songs'][0]['student_name'] = ''  # type: ignore
        except LookupError:  # aka KeyError or IndexError
            self.fail('Lookup error in test setup')
        serializer = GallerySerializer(data=data)
        self.assertFalse(serializer.is_valid())

    def test_validator_message_for_invalid_songId(self):

        def set_songId(value):
            data = self.mock_api_data
            try:
                data['song_groups'][0]['songs'][0]['songId'] = value  # type: ignore
            except LookupError:  # aka KeyError or IndexError
                self.fail('Lookup error in test setup')
            return data

        # wrong length
        serializer = GallerySerializer(data=set_songId('1234'))
        self.assertFalse(serializer.is_valid())

        # not numeric
        serializer = GallerySerializer(data=set_songId('abcdabcdabcdabcd'))
        self.assertFalse(serializer.is_valid())

        # not string
        serializer = GallerySerializer(data=set_songId({'value': '1234123412341234'}))
        self.assertFalse(serializer.is_valid())

    @ patch('gallery.serializers.fetch_and_cache')
    def test_song_data_caching_behavior(self, mock):
        """
        Cache as lazily as possible on first render only.
        """

        def fac_mock_implementation(*, songs):
            for s in songs:
                s.is_cached = True
            Song.objects.bulk_update(songs, ['is_cached'])
            return songs

        mock.side_effect = fac_mock_implementation
        instance = Gallery.objects.get(slug='test-title')
        ser = GallerySerializer(instance)

        # this call is what finally triggers something to happen in terms
        # of fetching and caching
        ser.data
        mock.assert_called()

        # now, if we do the same thing again, it shouldn't call the method
        mock.reset_mock()
        instance = Gallery.objects.get(slug='test-title')
        ser = GallerySerializer(instance)
        ser.data
        mock.assert_not_called()




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
        self.serializer = GallerySerializer(data=data, context={
            'user': self.user,
        })
        self.serializer.is_valid()

    def test_num_queries_on_create(self):
        """
        For a large gallery.
        """
        with CaptureQueriesContext(connection) as query_count:
            self.serializer.save()
        # TODO: optimize this; we did this in 15 queries with the old bloated
        # serializer
        self.assertLess(query_count.final_queries, 600)

    @ patch_fetch_and_cache
    def test_num_queries_on_initial_render(self):
        """
        num_queries = num_songs + 2
        """
        self.assertTrue(self.serializer.save())
        with CaptureQueriesContext(connection) as query_count:
            self.serializer.data
        # TODO: optimize this; we did this in 8 queries with the old bloated
        # serializer
        self.assertLess(query_count.final_queries, 30)

    @ patch_fetch_and_cache
    def test_num_queries_on_cached_render(self):
        """
        After caching has occuried, the .render() method will be less
        costly.
        """
        self.serializer.save()
        self.serializer.data
        with CaptureQueriesContext(connection) as query_count:
            self.serializer.data
        self.assertLess(query_count.final_queries, 10)
