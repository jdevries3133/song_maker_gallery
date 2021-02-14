from copy import deepcopy
import csv
from pathlib import Path
import json
import unittest
from unittest.mock import patch

from django.contrib.auth.models import User
from django import test
from django.test.utils import CaptureQueriesContext
from django.db import connection
from django.conf import settings
from django.core.exceptions import ValidationError
from rest_framework import serializers

from ..serializers import GalleryDatasetSerializer
from ..models import Gallery, SongGroup, Song
from .util import are_rendered_groups_same
from ..services import mock_data


class TestGallerySerializer(test.TestCase):
    """
    Gallery serializer handles normalizing bulk create request into models,
    and rendering gallery views from the database.
    """

    GALLERY_TITLE = 'Test Title'
    GALLERY_DESCRIPTION = 'This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.This is the test description.'

    maxDiff = None

    @ staticmethod
    def mock_api_data():
        """
        Always need to deep copy because the serializer pops group names out,
        mutating the nested list.
        """
        return deepcopy({
            'title': 'Test Title',
            'description': 'This is the test description.',
            'songData':  # JSON string
            """
                [
                  [
                    [
                      "Mark Johnson",
                      "https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912"
                    ],
                    [
                      "Mark J.",
                      "https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912"
                    ],
                    [
                      "Mark  Johnson  ",
                      "https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912  "
                    ],

                    [
                      "  Mark   l,;mavdl;sjgoawrjeoia jowgaow; ejioa Johnson",
                      "  https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912"
                    ],
                    "A Group of Marks"
                  ],
                  [
                    [
                      "Lilly Gohnson",
                      "https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912"
                    ],
                    [
                      "Lilly G.",
                      "https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912"
                    ],
                    [
                      "lilly  Gohnson",
                      "https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912"
                    ],
                    [
                      "Lilly   l,;mavdl;sjgoawrjeoia jowgaow; ejioa Gohnson",
                      "https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912"
                    ],
                    "A Group of Lillys"
                  ]
                ]
                """
        })

    def setUp(self):
        self.user = User.objects.create_user(  # type: ignore
            username='jack',
            email='jack@jack.com',
            password='ghjlesdfr;aghruiao;'
        )
        self._make_gallery()


    def _make_gallery(self, *, song_data=None) -> bool:
        if not song_data:
            song_data = self.mock_api_data()
        serializer = GalleryDatasetSerializer(
            data={
                'title': self.GALLERY_TITLE,
                'description': self.GALLERY_DESCRIPTION,
                'songData': song_data
            },
            context={
                'user': self.user,
            }
        )
        if serializer.is_valid():
            serializer.save()
            return True
        return False

    def test_gallery_single_gallery_exists(self):
        gallery_set = Gallery.objects.filter(slug='test-title')  # type: ignore
        self.assertEqual(len(gallery_set), 1)

    def test_gallery_title_and_description(self):
        gallery = Gallery.objects.get(slug='test-title')  # type: ignore
        self.assertEqual(gallery.title, 'Test Title')
        self.assertEqual(
            gallery.description,
            self.GALLERY_DESCRIPTION
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

    def test_gallery_serializer_render_method(self):
        """
       Render method makes a complex query and renders the data for the
        frontend to render a single gallery.
        """
        correct_output = {
            'description': 'This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.This is the test description.This is the test '
                'description.',
            'pk': 1,
            'slug': 'test-title',
            'songData': [[{'metadata': {'bars': 4,
                                     'beats': 4,
                                     'instrument': 'marimba',
                                     'octaves': 2,
                                     'percussion': 'electronic',
                                     'percussionNotes': 2,
                                     'rootNote': 48,
                                     'rootOctave': 4,
                                     'rootPitch': 0,
                                     'scale': 'major',
                                     'subdivision': 2,
                                     'tempo': 120},
                        'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                     b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                     b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                     b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                     b'NwAAgTkAsGD/LwA=',
                        'name': 'Mark J.',
                        'songId': '5676759593254912'},
                       {'metadata': {'bars': 4,
                                     'beats': 4,
                                     'instrument': 'marimba',
                                     'octaves': 2,
                                     'percussion': 'electronic',
                                     'percussionNotes': 2,
                                     'rootNote': 48,
                                     'rootOctave': 4,
                                     'rootPitch': 0,
                                     'scale': 'major',
                                     'subdivision': 2,
                                     'tempo': 120},
                        'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                     b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                     b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                     b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                     b'NwAAgTkAsGD/LwA=',
                        'name': 'Mark J.',
                        'songId': '5676759593254912'},
                       {'metadata': {'bars': 4,
                                     'beats': 4,
                                     'instrument': 'marimba',
                                     'octaves': 2,
                                     'percussion': 'electronic',
                                     'percussionNotes': 2,
                                     'rootNote': 48,
                                     'rootOctave': 4,
                                     'rootPitch': 0,
                                     'scale': 'major',
                                     'subdivision': 2,
                                     'tempo': 120},
                        'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                     b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                     b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                     b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                     b'NwAAgTkAsGD/LwA=',
                        'name': 'Mark J.',
                        'songId': '5676759593254912'},
                       {'metadata': {'bars': 4,
                                     'beats': 4,
                                     'instrument': 'marimba',
                                     'octaves': 2,
                                     'percussion': 'electronic',
                                     'percussionNotes': 2,
                                     'rootNote': 48,
                                     'rootOctave': 4,
                                     'rootPitch': 0,
                                     'scale': 'major',
                                     'subdivision': 2,
                                     'tempo': 120},
                        'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                     b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                     b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                     b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                     b'NwAAgTkAsGD/LwA=',
                        'name': 'Mark J.',
                        'songId': '5676759593254912'},
                       'A Group of Marks'],
                      [{'metadata': {'bars': 4,
                                     'beats': 4,
                                     'instrument': 'marimba',
                                     'octaves': 2,
                                     'percussion': 'electronic',
                                     'percussionNotes': 2,
                                     'rootNote': 48,
                                     'rootOctave': 4,
                                     'rootPitch': 0,
                                     'scale': 'major',
                                     'subdivision': 2,
                                     'tempo': 120},
                        'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                     b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                     b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                     b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                     b'NwAAgTkAsGD/LwA=',
                        'name': 'Lilly G.',
                        'songId': '5676759593254912'},
                       {'metadata': {'bars': 4,
                                     'beats': 4,
                                     'instrument': 'marimba',
                                     'octaves': 2,
                                     'percussion': 'electronic',
                                     'percussionNotes': 2,
                                     'rootNote': 48,
                                     'rootOctave': 4,
                                     'rootPitch': 0,
                                     'scale': 'major',
                                     'subdivision': 2,
                                     'tempo': 120},
                        'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                     b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                     b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                     b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                     b'NwAAgTkAsGD/LwA=',
                        'name': 'Lilly G.',
                        'songId': '5676759593254912'},
                       {'metadata': {'bars': 4,
                                     'beats': 4,
                                     'instrument': 'marimba',
                                     'octaves': 2,
                                     'percussion': 'electronic',
                                     'percussionNotes': 2,
                                     'rootNote': 48,
                                     'rootOctave': 4,
                                     'rootPitch': 0,
                                     'scale': 'major',
                                     'subdivision': 2,
                                     'tempo': 120},
                        'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                     b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                     b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                     b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                     b'NwAAgTkAsGD/LwA=',
                        'name': 'Lilly G.',
                        'songId': '5676759593254912'},
                       {'metadata': {'bars': 4,
                                     'beats': 4,
                                     'instrument': 'marimba',
                                     'octaves': 2,
                                     'percussion': 'electronic',
                                     'percussionNotes': 2,
                                     'rootNote': 48,
                                     'rootOctave': 4,
                                     'rootPitch': 0,
                                     'scale': 'major',
                                     'subdivision': 2,
                                     'tempo': 120},
                        'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                     b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                     b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                     b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                     b'NwAAgTkAsGD/LwA=',
                        'name': 'Lilly G.',
                        'songId': '5676759593254912'},
                       'A Group of Lillys']],
            'title': 'Test Title'
        }
        with self.settings(SKIP_FETCH_AND_CACHE=False):
            rendered = GalleryDatasetSerializer().render('test-title')
            self.assertTrue(are_rendered_groups_same(
                correct_output,
                rendered
            ))

    def test_render_many(self):
        self._make_gallery()
        result = GalleryDatasetSerializer(
            context={
                'user': self.user,
            }).render_many()
        self.assertTrue(
            are_rendered_groups_same(
                result[0],
                result[1],
            )
        )

    def test_render_method_num_queries(self):
        with self.settings(SKIP_FETCH_AND_CACHE=False):
            GalleryDatasetSerializer().render('test-title')
            with self.assertNumQueries(4):
                GalleryDatasetSerializer().render('test-title')

    def test_rendered_gallery_matches_source_data(self):

        with self.settings(SKIP_FETCH_AND_CACHE=False):
            self.assertTrue(
                are_rendered_groups_same(
                    GalleryDatasetSerializer().render('test-title'),
                    {'description': 'This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.This is the test description.This is the test '
                                    'description.',
                     'pk': 1,
                     'slug': 'test-title',
                     'songData': [[{'metadata': {'bars': 4,
                                                 'beats': 4,
                                                 'instrument': 'marimba',
                                                 'octaves': 2,
                                                 'percussion': 'electronic',
                                                 'percussionNotes': 2,
                                                 'rootNote': 48,
                                                 'rootOctave': 4,
                                                 'rootPitch': 0,
                                                 'scale': 'major',
                                                 'subdivision': 2,
                                                 'tempo': 120},
                                    'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                                 b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                                 b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                                 b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                                 b'NwAAgTkAsGD/LwA=',
                                    'name': 'Mark J.',
                                    'songId': '5676759593254912'},
                                   {'metadata': {'bars': 4,
                                                 'beats': 4,
                                                 'instrument': 'marimba',
                                                 'octaves': 2,
                                                 'percussion': 'electronic',
                                                 'percussionNotes': 2,
                                                 'rootNote': 48,
                                                 'rootOctave': 4,
                                                 'rootPitch': 0,
                                                 'scale': 'major',
                                                 'subdivision': 2,
                                                 'tempo': 120},
                                    'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                                 b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                                 b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                                 b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                                 b'NwAAgTkAsGD/LwA=',
                                    'name': 'Mark J.',
                                    'songId': '5676759593254912'},
                                   {'metadata': {'bars': 4,
                                                 'beats': 4,
                                                 'instrument': 'marimba',
                                                 'octaves': 2,
                                                 'percussion': 'electronic',
                                                 'percussionNotes': 2,
                                                 'rootNote': 48,
                                                 'rootOctave': 4,
                                                 'rootPitch': 0,
                                                 'scale': 'major',
                                                 'subdivision': 2,
                                                 'tempo': 120},
                                    'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                                 b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                                 b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                                 b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                                 b'NwAAgTkAsGD/LwA=',
                                    'name': 'Mark J.',
                                    'songId': '5676759593254912'},
                                   {'metadata': {'bars': 4,
                                                 'beats': 4,
                                                 'instrument': 'marimba',
                                                 'octaves': 2,
                                                 'percussion': 'electronic',
                                                 'percussionNotes': 2,
                                                 'rootNote': 48,
                                                 'rootOctave': 4,
                                                 'rootPitch': 0,
                                                 'scale': 'major',
                                                 'subdivision': 2,
                                                 'tempo': 120},
                                    'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                                 b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                                 b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                                 b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                                 b'NwAAgTkAsGD/LwA=',
                                    'name': 'Mark J.',
                                    'songId': '5676759593254912'},
                                   'A Group of Marks'],
                                  [{'metadata': {'bars': 4,
                                                 'beats': 4,
                                                 'instrument': 'marimba',
                                                 'octaves': 2,
                                                 'percussion': 'electronic',
                                                 'percussionNotes': 2,
                                                 'rootNote': 48,
                                                 'rootOctave': 4,
                                                 'rootPitch': 0,
                                                 'scale': 'major',
                                                 'subdivision': 2,
                                                 'tempo': 120},
                                    'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                                 b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                                 b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                                 b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                                 b'NwAAgTkAsGD/LwA=',
                                    'name': 'Lilly G.',
                                    'songId': '5676759593254912'},
                                   {'metadata': {'bars': 4,
                                                 'beats': 4,
                                                 'instrument': 'marimba',
                                                 'octaves': 2,
                                                 'percussion': 'electronic',
                                                 'percussionNotes': 2,
                                                 'rootNote': 48,
                                                 'rootOctave': 4,
                                                 'rootPitch': 0,
                                                 'scale': 'major',
                                                 'subdivision': 2,
                                                 'tempo': 120},
                                    'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                                 b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                                 b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                                 b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                                 b'NwAAgTkAsGD/LwA=',
                                    'name': 'Lilly G.',
                                    'songId': '5676759593254912'},
                                   {'metadata': {'bars': 4,
                                                 'beats': 4,
                                                 'instrument': 'marimba',
                                                 'octaves': 2,
                                                 'percussion': 'electronic',
                                                 'percussionNotes': 2,
                                                 'rootNote': 48,
                                                 'rootOctave': 4,
                                                 'rootPitch': 0,
                                                 'scale': 'major',
                                                 'subdivision': 2,
                                                 'tempo': 120},
                                    'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                                 b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                                 b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                                 b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                                 b'NwAAgTkAsGD/LwA=',
                                    'name': 'Lilly G.',
                                    'songId': '5676759593254912'},
                                   {'metadata': {'bars': 4,
                                                 'beats': 4,
                                                 'instrument': 'marimba',
                                                 'octaves': 2,
                                                 'percussion': 'electronic',
                                                 'percussionNotes': 2,
                                                 'rootNote': 48,
                                                 'rootOctave': 4,
                                                 'rootPitch': 0,
                                                 'scale': 'major',
                                                 'subdivision': 2,
                                                 'tempo': 120},
                                    'midiBytes': b'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRy'
                                                 b'awAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/'
                                                 b'AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4A'
                                                 b'AJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CB'
                                                 b'NwAAgTkAsGD/LwA=',
                                    'name': 'Lilly G.',
                                    'songId': '5676759593254912'},
                                   'A Group of Lillys']],
                     'title': 'Test Title'}
                )
            )

    def test_render_many_max_galleries(self):
        for _ in range(5):
            self._make_gallery()
        rendered = GalleryDatasetSerializer(context={
            'user': self.user
        }).render_many(max_galleries=3)
        self.assertEqual(len(rendered), 3)

    def test_duplicate_group_names_are_invalid(self):
        # self._make_gallery returns false if the serializer is invalid.
        self.assertFalse(
            self._make_gallery(
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

    @ patch('gallery.services.requests.models.Response.json', side_effect=ValueError)
    def test_bad_api_response_causes_mock_data_assignment(self, mock_json):
        self._make_gallery()
        with self.settings(SKIP_FETCH_AND_CACHE=False):
            rendered = (
                GalleryDatasetSerializer().render(
                    slug=Gallery.objects.all().last().slug)  # type: ignore
            )
            for group in rendered['songData']:
                for song in group[:-1]:
                    for k, v in mock_data.items():
                        self.assertEqual(
                            v,
                            song.get('metadata').get(k),
                        )

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

    def test_num_queries_on_initial_render(self):
        """
        num_queries = num_songs + 2
        """
        self.serializer.save()
        with CaptureQueriesContext(connection) as query_count:
            self.serializer.render(slug='sample-gallery')
        self.assertEqual(query_count.final_queries, 8)

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
        rows.append('Test Group')
        return [rows]

    def test_validator_message_for_empty_link(self):
        with open(Path(self.UI_TEST_DATA_DIR, 'empty_link.csv'), 'r') as csvf:
            rows = [r for r in csv.reader(csvf)][1:]
        expect = (
            'The following row of the spreadsheet for your group, '
            '"Test Group," does not contain two items.'
        )
        with self.assertRaisesMessage(serializers.ValidationError, expect):
            GalleryDatasetSerializer.validate_songData(
                self._make_song_data(rows)
            )
        expect = (
            'Instead, it contains: [\'Jamir\']'
        )
        with self.assertRaisesMessage(serializers.ValidationError, expect):
            GalleryDatasetSerializer.validate_songData(
                self._make_song_data(rows)
            )

    def test_validator_message_for_empty_name(self):
        with open(Path(self.UI_TEST_DATA_DIR, 'empty_name.csv'), 'r') as csvf:
            rows = [r for r in csv.reader(csvf)][1:]
        expect = (
            'The following row of the spreadsheet for your group, '
            '"Test Group," does not contain two items.'
        )
        with self.assertRaisesMessage(serializers.ValidationError, expect):
            GalleryDatasetSerializer.validate_songData(
                self._make_song_data(rows)
            )
        expect = (
            "Instead, it contains: [\'https://musiclab.chromeexperiments.com/"
            "Song-Maker/song/4914262951591936\']"
        )
        with self.assertRaisesMessage(serializers.ValidationError, expect):
            GalleryDatasetSerializer.validate_songData(
                self._make_song_data(rows)
            )

    def test_validator_message_for_empty_row(self):
        with open(Path(self.UI_TEST_DATA_DIR, 'empty_row.csv'), 'r') as csvf:
            rows = [r for r in csv.reader(csvf)][1:]
        expect = (
            'The spreadsheet for the group, "Test Group," contains one or '
            'more empty rows'
        )
        with self.assertRaisesMessage(serializers.ValidationError, expect):
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
                'The Song Maker link for Jamir '
                f'({rows[2][1]}) '
                'is not valid.'
            )
            with self.assertRaisesMessage(
                serializers.ValidationError,
                expect
            ):
                GalleryDatasetSerializer.validate_songData(
                    self._make_song_data(rows)
                )

    def test_complex_validator(self):
        """
        Validation case where multiple errors should be sent back.
        """
