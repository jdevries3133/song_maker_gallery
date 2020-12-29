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

    maxDiff = None

    def mock_api_data(self):
        """
        Always need to deep copy because the serializer pops group names out,
        mutating the nested list.
        """
        return deepcopy({
            'title': 'Test Title',
            'description': 'This is the test description.',
            'songData': [
                [
                    [
                        'Mark Johnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/4618345650632704',
                    ],
                    [
                        'Mark J.',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/4613455650632704',
                    ],
                    [
                        'Mark  Johnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/1238045650632704',
                    ],

                    [
                        'Mark   l,;mavdl;sjgoawrjeoia jowgaow; ejioa Johnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/4618045634532704',
                    ],
                    'A Group of Marks',
                ],
                [
                    [
                        'Lilly Gohnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/4618045123632704',
                    ],
                    [
                        'Lilly G.',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/4618041220632704',
                    ],
                    [
                        'lilly  Gohnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/4618045650632704',
                    ],
                    [
                        'Lilly   l,;mavdl;sjgoawrjeoia jowgaow; ejioa Gohnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/4618045650632704',
                    ],
                    'A Group of Lillys'
                ]
            ]
        })

    def setUp(self):
        self.user = User.objects.create_user(  # type: ignore
            username='jack',
            email='jack@jack.com',
            password='ghjlesdfr;aghruiao;'
        )
        serializer = GalleryDatasetSerializer(
            data=self.mock_api_data(),
            context={
                'user': self.user,
            }
        )
        if serializer.is_valid():
            serializer.save()
        else:
            raise Exception('Serializer in setUp method was not valid')

    def test_gallery_single_gallery_exists(self):
        gallery_set = Gallery.objects.filter(slug='test-title')  # type: ignore
        self.assertEqual(len(gallery_set), 1)

    def test_gallery_title_and_description(self):
        gallery = Gallery.objects.get(slug='test-title')  # type: ignore
        self.assertEqual(gallery.title, 'Test Title')
        self.assertEqual(
            gallery.description,
            'This is the test description.'
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
                        'song/4618045650632704',
                    ],
                    [
                        'Suzy Goodlink',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/4618345650632704',
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
                        'song/4618345650632704'
                    ],
                    [
                        'Student Name',
                        'https://musiclab.chromeexperiments.com/Song-Maker/'
                        'song/4618345650632704'
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
            'title': 'Test Title',
            'description': 'This is the test description.',
            'songData': [
                [
                    ('Mark J.', '4618345650632704'),
                    ('Mark J.', '4613455650632704'),
                    ('Mark J.', '1238045650632704'),
                    ('Mark J.', '4618045634532704')
                ],
                [
                    ('Lilly G.', '4618045123632704'),
                    ('Lilly G.', '4618041220632704'),
                    ('Lilly G.', '4618045650632704'),
                    ('Lilly G.', '4618045650632704')
                ]
            ]
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
        # create a second gallery
        second_gal_data = self.mock_api_data()
        serializer = GalleryDatasetSerializer(data=second_gal_data, context={
            'user': self.user
        })
        self.assertTrue(serializer.is_valid())
        serializer.save()
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
        with self.assertNumQueries(4):
            GalleryDatasetSerializer().render('test-title')

    def test_rendered_gallery_matches_source_data(self):
        self.assertTrue(
            are_rendered_groups_same(
                GalleryDatasetSerializer().render('test-title'),
                {
                    'title': 'Test Title',
                    'description': 'This is the test description.',
                    'songData': [
                        [
                            ('Mark J.', '4618345650632704'),
                            ('Mark J.', '4613455650632704'),
                            ('Mark J.', '1238045650632704'),
                            ('Mark J.', '4618045634532704')
                        ],
                        [
                            ('Lilly G.', '4618045123632704'),
                            ('Lilly G.', '4618041220632704'),
                            ('Lilly G.', '4618045650632704'),
                            ('Lilly G.', '4618045650632704')
                        ]
                    ]
                }
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
