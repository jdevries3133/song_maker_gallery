import json

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.test import TestCase, Client

from ..models import Gallery
from ..serializers import GalleryDatasetSerializer


class GalleryTestCase(TestCase):
    def setUp(self):
        self.mock_api_data =  {
            'title': 'Test Title',
            'description': 'This is the test description.',
            'songData': [
                [
                    [
                        'Mark Johnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912'
                    ],
                    [
                        'Mark J.',
                        'https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912'
                    ],
                    [
                        'Mark  Johnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912'
                    ],

                    [
                        'Mark   l,;mavdl;sjgoawrjeoia jowgaow; ejioa Johnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912'
                    ],
                    'A Group of Marks',
                ],
                [
                    [
                        'Lilly Gohnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912'
                    ],
                    [
                        'Lilly G.',
                        'https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912'
                    ],
                    [
                        'lilly  Gohnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912'
                    ],
                    [
                        'Lilly   l,;mavdl;sjgoawrjeoia jowgaow; ejioa Gohnson',
                        'https://musiclab.chromeexperiments.com/Song-Maker/song/5676759593254912'
                    ],
                    'A Group of Lillys'
                ]
            ]
        }
        self.expected_rendered_data = {
            'pk': 1,
            'title': 'Test Title',
            'description': 'This is the test description.',
            'songData': [
                [
                    ['Mark J.', '5676759593254912'],
                    ['Mark J.', '5676759593254912'],
                    ['Mark J.', '5676759593254912'],
                    ['Mark J.', '5676759593254912']],
                [
                    ['Lilly G.', '5676759593254912'],
                    ['Lilly G.', '5676759593254912'],
                    ['Lilly G.', '5676759593254912'],
                    ['Lilly G.', '5676759593254912']
                ]
            ],
        }
        self.user = User.objects.create_user(
            username='jack',
            email='jack@jack.com',
            password='ghjlesdfr;aghruiao;'
        )
        self.client = Client()

        # create an initial gallery
        self.gallery = self._add_gallery()

    def _login_client(self):
        """
        Not called by default, but can be called to test with an authenticated
        client.

        Note that the token still must be included in all requests because
        of this project's authentication scheme as seen in the setup method
        for TestAuthGalleryViewset below. This method simply provides a token
        """
        self.token = json.loads(
            self.client.post(
                '/api/auth/login/',
                data={
                    'username': 'jack',
                    'password': 'ghjlesdfr;aghruiao;',
                },
                content_type='application/json'
            ).rendered_content  # type: ignore
        )['token']

    def _add_gallery(self) -> Gallery:
        """
        Add a gallery to the database – all clones of the first.
        """
        serializer = GalleryDatasetSerializer(data=self.mock_api_data, context={
            'user': self.user,
        })
        serializer.is_valid(raise_exception=True)
        return serializer.save()

