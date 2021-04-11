from copy import deepcopy
import json
from typing import Union, Iterable, Generator
from unittest.mock import patch

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.test import TestCase, Client

from ..models import Gallery, Song
from ..serializers import GalleryDatasetSerializer
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
        # all songs look like this
        song = {
            'metadata': {
                'bars': 1,
                 'beats': 4,
                 'instrument': 'piano',
                 'octaves': 2,
                 'percussion': 'electronic',
                 'percussionNotes': 2,
                 'rootNote': 48,
                 'rootOctave': 4,
                 'rootPitch': 0,
                 'scale': 'major',
                 'subdivision': 2,
                 'tempo': 91
            },
            'midiBytes': b''
        }
        return {
            'title': 'Test Title',
            'description': 'This is the test description.',
            'pk': 1,
            'slug': 'test-title',
            'songData': [
                [
                    {
                    'name': 'Mark J.',
                    'songId': '5676759593254912',
                    **song
                    } for _ in range(4)
                ] + ['A Group of Marks'],  # type: ignore
                [
                    {
                    'name': 'Lilly G.',
                    'songId': '5676759593254912',
                    **song
                    } for _ in range(4)
                ] + ['A Group of Lillys']  # type: ignore
            ]
        }





    def setUp(self):
        self.user = User.objects.create_user(
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

    def _add_gallery(self, *, song_data=None) -> Union[Gallery, None]:
        full_data = self.mock_api_data
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
