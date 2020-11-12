from django.contrib.auth.models import User
from django import test

from gallery.serializers import GalleryDatasetSerializer
from gallery.models import Gallery, SongGroup, Song, StudentName


class TestGallerySerializer(test.TestCase):
    """
    Gallery serializer handles normalizing bulk create request into models,
    and rendering gallery views from the database.
    """

    def setUp(self):
        self.mock_api_data =  {
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
        }
        user = User.objects.create_user(
            username='jack',
            email='jack@jack.com',
            password='ghjlesdfr;aghruiao;'
        )
        serializer = GalleryDatasetSerializer(data=self.mock_api_data, context={
            'user': user,
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()

    def test_gallery_single_gallery_exists(self):
        gallery_set = Gallery.objects.filter(slug='test-title')
        self.assertEqual(len(gallery_set), 1)

    def test_gallery_title_and_description(self):
        gallery = Gallery.objects.get(slug='test-title')
        self.assertEqual(gallery.title, 'Test Title')
        self.assertEqual(
            gallery.description,
            'This is the test description.'
        )

    def test_correct_number_of_Song_objects_are_created(self):
        """
        Bulk create action performed in self.setUp should create Song
        objects to store each of the songs. Songs are linked by ManyToManyField,
        and their ids are unique, so a song is never stored twice.

        Therefore, we expect to see 7 songs created from the sample data, since
        the last two songs are the same.
        """
        songs = Song.objects.all()
        self.assertEqual(
            len(songs),
            7
        )

    def test_correct_number_of_SongGroup_objects_are_created(self):
        """
        Bulk create action perfoemed in self.setUp should create SongGroup
        objects to store each of the groupings of songs.
        """
        song_groups = SongGroup.objects.all()
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
        for name in StudentName.objects.all():
            self.assertIn(
                name.name,
                [
                    'Mark J.',
                    'Lilly G.'
                ]
            )

    def songmaker_urls_have_been_validated(self):
        """
        All urls should be valid according to the following regex.
        """
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

        contains_good_urls = GalleryDatasetSerializer(data={
            'title': 'title',
            'description': 'description',
            'songData': [
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
        })

        self.assertFalse(contains_invalid_url.is_valid())
        self.assertTrue(contains_good_urls.is_valid())
