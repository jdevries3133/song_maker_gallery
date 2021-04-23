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
from rest_framework import serializers

from .base_case import GalleryTestCase, patch_fetch_and_cache
from .util import are_rendered_groups_same
from ..serializers import GalleryDatasetSerializer
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
        self._add_gallery()

    def old_setUp(self):
        raise Exception('depricated')
        self.user = User.objects.create_user(  # type: ignore
            username='jack',
            email='jack@jack.com',
            password='ghjlesdfr;aghruiao;'
        )
        self._make_gallery()

    def test_gallery_single_gallery_exists(self):
        gallery_set = Gallery.objects.filter(slug='test-title')  # type: ignore
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

    def test_songmaker_urls_have_been_validated(self):
        """
        All urls should be valid musiclab links.
        """
        contains_good_urls = GalleryDatasetSerializer(data={
            'title': 'title',
            'description': 'description',
            'songData': [
                [
                    [
                        'Insecure Bryan',
                        'http://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/5676759593254912',
                    ],
                    [
                        'Suzy Goodlink',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/5676759593254912',
                    ],
                    'Good Link Group'
                ]
            ]
        })
        self.assertTrue(contains_good_urls.is_valid())

        contains_invalid_url = GalleryDatasetSerializer(data={
            'title': 'title',
            'description': 'description',
            'songData': [
                [
                    [
                        'Linda Badlink',
                        'http://wrongsite.com'
                    ],
                    'Bad Link Group',
                ]
            ]
        })
        self.assertFalse(contains_invalid_url.is_valid())

        wrong_data_structure = GalleryDatasetSerializer(data={
            'title': 'title',
            'description': 'description',
            'songData': [
                'wrong',
                [
                    'something',
                    'else',
                ],
                [
                    [
                        'Student Name',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/5676759593254912'
                    ],
                    [
                        'Student Name',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/5676759593254912'
                    ]
                ]
            ]
        })
        self.assertFalse(wrong_data_structure.is_valid())


    @ patch_fetch_and_cache
    def test_gallery_serializer_render_method(self):
        """
        Render method makes a complex query and renders the data for the
        frontend to render a single gallery.
        """
        rendered = GalleryDatasetSerializer().render('test-title')
        self.assertTrue(are_rendered_groups_same(
            self.expected_rendered_data,
            rendered
        ))

    @ patch_fetch_and_cache
    def test_render_method_num_queries(self):
        GalleryDatasetSerializer().render('test-title')
        with self.assertNumQueries(4):
            GalleryDatasetSerializer().render('test-title')

    def test_duplicate_group_names_are_invalid(self):
        self.assertFalse(
            self._add_gallery(
                song_data=[
                    [
                        'Mark J.',
                        'https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912'
                    ], 'group',
                    [
                        'Mark J.',
                        'https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912'
                    ], 'group',
                ]
            )
        )


    # TODO: move to iter_fetch_and_cache test suite

    # @ patch('gallery.services.requests.models.Response.json', side_effect=ValueError)
    # def test_bad_api_response_causes_mock_data_assignment(self, mock_json):
    #     self._add_gallery()
    #     with self.settings(SKIP_FETCH_AND_CACHE=False):
    #         rendered = (
    #             GalleryDatasetSerializer().render(
    #                 slug=Gallery.objects.all().last().slug)  # type: ignore
    #         )
    #         for group in rendered['songData']:
    #             for song in group[:-1]:
    #                 for k, v in mock_data.items():
    #                     self.assertEqual(
    #                         v,
    #                         song.get('metadata').get(k),
    #                     )








class TestQueryCountLargeGallery(test.TestCase):

    def setUp(self):
        self.user = User.objects.create_user(  # type: ignore
            username='jack',
            email='jack@jack.com',
            password='ghjlesdfr;aghruiao;'
        )
        with open(
            Path(Path(__file__).parent, 'mock_data', 'gallery_post_request_data_example.json'), 'r'
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
