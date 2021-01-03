from copy import deepcopy
from pathlib import Path
import json

from django.contrib.auth.models import User
from django import test
from django.test.utils import CaptureQueriesContext
from django.db import connection
from django.conf import settings

from ..serializers import GalleryDatasetSerializer
from ..models import Gallery, SongGroup, Song
from .util import are_rendered_groups_same


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
                      "Mark  Johnson",
                      "https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912"
                    ],

                    [
                      "Mark   l,;mavdl;sjgoawrjeoia jowgaow; ejioa Johnson",
                      "https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912"
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


    def _make_gallery(self):
        serializer = GalleryDatasetSerializer(
            data={
                'title': self.GALLERY_TITLE,
                'description': self.GALLERY_DESCRIPTION,
                'songData': self.mock_api_data(),
            },
            context={
                'user': self.user,
            }
        )
        if serializer.is_valid():
            serializer.save()
        else:
            raise Exception(
                'Serializer in setUp method was not valid due to '
                f'errors: {serializer.errors}'

            )

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
        rendered = GalleryDatasetSerializer().render('test-title')
        self.assertEqual(rendered, correct_output)
        try:
            # check that the full songData nested lists are right.
            for correct, rendered in zip(
                correct_output['songData'],
                rendered['songData']
            ):
                self.assertEqual(correct, rendered)
                for correct, rendered in zip(correct, rendered):
                    self.assertEqual(correct, rendered)
        except:
            raise Exception("songData is not correct")

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
        GalleryDatasetSerializer().render('test-title')
        with self.assertNumQueries(4):
            GalleryDatasetSerializer().render('test-title')

    def test_rendered_gallery_matches_source_data(self):
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


class TestQueryCountLargeGallery(test.TestCase):

    def setUp(self):
        self.user = User.objects.create_user(  # type: ignore
            username='jack',
            email='jack@jack.com',
            password='ghjlesdfr;aghruiao;'
        )
        with open(
            Path(settings.BASE_DIR, 'gallery', 'sample-gallery.json'), 'r'
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
        Initial render call will trigger cachine, and therefore make an
        insertion on every song.
        """
        self.serializer.save()
        self.serializer.render(slug='sample-gallery')
        with CaptureQueriesContext(connection) as query_count:
            self.serializer.render(slug='sample-gallery')
        self.assertLess(query_count.final_queries, 30)

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
