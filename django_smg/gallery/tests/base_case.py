from copy import deepcopy
import json
from typing import Union, Iterable, Generator
from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase, Client

from ..models import Gallery, Song
from ..serializers import GalleryDatasetSerializer, GallerySerializer
from ..services import mock_data as default_api_return_data



def mock_iter_fetch_and_cache(songs: Iterable[Song]
                              ) -> Generator[Song, None, None]:
    for song in songs:
        for k, v in default_api_return_data.items():
            setattr(song, k, v)
        song.midi = b''  # type: ignore
        yield song


def patch_fetch_and_cache(func):
    def wrap(*a, **kw):
        with patch('gallery.serializers.iter_fetch_and_cache') as p:
            p.side_effect = mock_iter_fetch_and_cache
            func(*a, **kw)
    return wrap


class GalleryTestCase(TestCase):

    @ property
    def mock_api_data(self):
        return deepcopy({
        'title': 'Test Title',
        'description': 'This is the test description.',
            'song_groups': [
                {'group_name': 'A Group of Marks',
                  'songs': [{'songId': '5676759593254912',
                             'student_name': 'Mark Johnson'},
                            {'songId': '5676759593254912',
                             'student_name': 'Mark J.'},
                            {'songId': '5676759593254912',
                             'student_name': 'Mark  Johnson'},
                            {'songId': '5676759593254912',
                             'student_name': 'Mark   l,;mavdl;sjgoawrjeoia jowgaow; ejioa '
                                             'Johnson'}]},
                 {'group_name': 'A Group of Lillys',
                  'songs': [{'songId': '5676759593254912',
                             'student_name': 'Lilly Gohnson'},
                            {'songId': '5676759593254912',
                             'student_name': 'Lilly G.'},
                            {'songId': '5676759593254912',
                             'student_name': 'lilly  Gohnson'},
                            {'songId': '5676759593254912',
                             'student_name': 'Lilly   l,;mavdl;sjgoawrjeoia jowgaow; ejioa '
                                             'Gohnson'}]}
            ]
        })

    @ property
    def depr_mock_api_data(self):
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

    @ property
    def expected_rendered_data(self):
        return {'description': 'This is the test description.',
         'song_groups': [{'group_name': 'A Group of Marks',
                          'songs': [{'songId': '5676759593254912',
                                     'student_name': 'Mark J.'},
                                    {'songId': '5676759593254912',
                                     'student_name': 'Mark J.'},
                                    {'songId': '5676759593254912',
                                     'student_name': 'Mark J.'},
                                    {'songId': '5676759593254912',
                                     'student_name': 'Mark J.'}]},
                         {'group_name': 'A Group of Lillys',
                          'songs': [{'songId': '5676759593254912',
                                     'student_name': 'Lilly G.'},
                                    {'songId': '5676759593254912',
                                     'student_name': 'Lilly G.'},
                                    {'songId': '5676759593254912',
                                     'student_name': 'Lilly G.'},
                                    {'songId': '5676759593254912',
                                     'student_name': 'Lilly G.'}]}],
         'title': 'Test Title'}

    def setUp(self):
        self.user = User.objects.create_user(  # type: ignore
            username='jack',
            email='jack@jack.com',
            password='ghjlesdfr;aghruiao;'
        )
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
                content_type='application/json',
                secure=True
            ).rendered_content  # type: ignore
        )['token']

    def depr_add_gallery(self, *, song_data=None) -> Union[Gallery, None]:
        full_data = self.depr_mock_api_data
        if song_data:
           full_data['songData'] = song_data
        serializer = GalleryDatasetSerializer(
            data=full_data,
            context={
                'user': self.user,
            }
        )
        if serializer.is_valid():
            result = serializer.save()
            if isinstance(result, Gallery):
                return result

    def add_gallery(self, *, song_data=None):
        full_data = self.mock_api_data
        if song_data:
            full_data['song_groups'] = song_data
        serializer = GallerySerializer(data=full_data)
        if serializer.is_valid():
            return serializer.save()
