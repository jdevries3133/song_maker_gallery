import json

from django.urls import reverse
from django.contrib.auth.models import User
from django.test import TestCase, Client

from ..serializers import GalleryDatasetSerializer
from .util import are_rendered_groups_same


class _LocalBaseTestCase(TestCase):
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
        self.user = User.objects.create_user(
            username='jack',
            email='jack@jack.com',
            password='ghjlesdfr;aghruiao;'
        )
        serializer = GalleryDatasetSerializer(data=self.mock_api_data, context={
            'user': self.user,
        })
        serializer.is_valid(raise_exception=True)
        self.gallery = serializer.save()
        self.client = Client()

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

class TestAuthGalleryViewset(_LocalBaseTestCase):

    def setUp(self):
        super().setUp()
        self._login_client()
        url = reverse('auth_gallery')
        self.response = self.client.get(
            url,
            HTTP_AUTHORIZATION=f'Token {self.token}',
        )


    def test_response_status(self):
        self.assertIn(self.response.status_code, range(200, 300)) # type: ignore

    def test_response_content(self):
        self.assertEqual(
            self.response.json()[0]['title'],  # type: ignore
            self.mock_api_data['title']
        )
        self.assertEqual(
            self.response.json()[0]['description'],  # type: ignore
            self.mock_api_data['description']
        )

class TestPublicGalleryViewset(_LocalBaseTestCase):

    def test_get_request(self):
        url = reverse('public_gallery', kwargs={
            'slug': 'test-title'
        })
        response = self.client.get(url)
        self.assertTrue(are_rendered_groups_same(
            response.json(),
            {'description': 'This is the test description.',
             'songData': [[['Mark J.', '4618345650632704'],
                           ['Mark J.', '4613455650632704'],
                           ['Mark J.', '1238045650632704'],
                           ['Mark J.', '4618045634532704']],
                          [['Lilly G.', '4618045123632704'],
                           ['Lilly G.', '4618041220632704'],
                           ['Lilly G.', '4618045650632704'],
                           ['Lilly G.', '4618045650632704']]],
             'title': 'Test Title'}
        ))

