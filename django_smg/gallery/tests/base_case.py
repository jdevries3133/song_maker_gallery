from copy import deepcopy
import json
from types import SimpleNamespace
from typing import OrderedDict
from unittest.mock import patch

from django.contrib.auth.models import User
from django.test import TestCase, Client
from rest_framework.response import Response

from ..models import Gallery, Song
from ..serializers import GallerySerializer
from ..services import mock_data as default_api_return_data


def mock_fetch_and_cache(songs):
    for song in songs:
        for k, v in default_api_return_data.items():
            setattr(song, k, v)
        song.midi = b''  # type: ignore
    return songs


def patch_fetch_and_cache(func):
    def wrap(*a, **kw):
        with patch('gallery.serializers.fetch_and_cache') as p:
            p.side_effect = mock_fetch_and_cache
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
    def expected_rendered_data(self):
        return {'description': 'This is the test description.',
         'owner': 1,
         'pk': 1,
         'slug': 'test-title',
         'song_groups': [{'group_name': 'A Group of Marks',
                          'owner': 1,
                          'songs': [{'bars': None,
                                     'beats': None,
                                     'instrument': None,
                                     'midi': None,
                                     'octaves': None,
                                     'order': 0,
                                     'owner': 1,
                                     'percussion': None,
                                     'percussionNotes': None,
                                     'rootNote': None,
                                     'rootOctave': None,
                                     'rootPitch': None,
                                     'scale': None,
                                     'songId': '5676759593254912',
                                     'student_name': 'Mark J.',
                                     'subdivision': None,
                                     'tempo': None},
                                    {'bars': None,
                                     'beats': None,
                                     'instrument': None,
                                     'midi': None,
                                     'octaves': None,
                                     'order': 1,
                                     'owner': 1,
                                     'percussion': None,
                                     'percussionNotes': None,
                                     'rootNote': None,
                                     'rootOctave': None,
                                     'rootPitch': None,
                                     'scale': None,
                                     'songId': '5676759593254912',
                                     'student_name': 'Mark J.',
                                     'subdivision': None,
                                     'tempo': None},
                                    {'bars': None,
                                     'beats': None,
                                     'instrument': None,
                                     'midi': None,
                                     'octaves': None,
                                     'order': 2,
                                     'owner': 1,
                                     'percussion': None,
                                     'percussionNotes': None,
                                     'rootNote': None,
                                     'rootOctave': None,
                                     'rootPitch': None,
                                     'scale': None,
                                     'songId': '5676759593254912',
                                     'student_name': 'Mark J.',
                                     'subdivision': None,
                                     'tempo': None},
                                    {'bars': None,
                                     'beats': None,
                                     'instrument': None,
                                     'midi': None,
                                     'octaves': None,
                                     'order': 3,
                                     'owner': 1,
                                     'percussion': None,
                                     'percussionNotes': None,
                                     'rootNote': None,
                                     'rootOctave': None,
                                     'rootPitch': None,
                                     'scale': None,
                                     'songId': '5676759593254912',
                                     'student_name': 'Mark J.',
                                     'subdivision': None,
                                     'tempo': None}]},
                         {'group_name': 'A Group of Lillys',
                          'owner': 1,
                          'songs': [{'bars': None,
                                     'beats': None,
                                     'instrument': None,
                                     'midi': None,
                                     'octaves': None,
                                     'order': 0,
                                     'owner': 1,
                                     'percussion': None,
                                     'percussionNotes': None,
                                     'rootNote': None,
                                     'rootOctave': None,
                                     'rootPitch': None,
                                     'scale': None,
                                     'songId': '5676759593254912',
                                     'student_name': 'Lilly G.',
                                     'subdivision': None,
                                     'tempo': None},
                                    {'bars': None,
                                     'beats': None,
                                     'instrument': None,
                                     'midi': None,
                                     'octaves': None,
                                     'order': 1,
                                     'owner': 1,
                                     'percussion': None,
                                     'percussionNotes': None,
                                     'rootNote': None,
                                     'rootOctave': None,
                                     'rootPitch': None,
                                     'scale': None,
                                     'songId': '5676759593254912',
                                     'student_name': 'Lilly G.',
                                     'subdivision': None,
                                     'tempo': None},
                                    {'bars': None,
                                     'beats': None,
                                     'instrument': None,
                                     'midi': None,
                                     'octaves': None,
                                     'order': 2,
                                     'owner': 1,
                                     'percussion': None,
                                     'percussionNotes': None,
                                     'rootNote': None,
                                     'rootOctave': None,
                                     'rootPitch': None,
                                     'scale': None,
                                     'songId': '5676759593254912',
                                     'student_name': 'Lilly G.',
                                     'subdivision': None,
                                     'tempo': None},
                                    {'bars': None,
                                     'beats': None,
                                     'instrument': None,
                                     'midi': None,
                                     'octaves': None,
                                     'order': 3,
                                     'owner': 1,
                                     'percussion': None,
                                     'percussionNotes': None,
                                     'rootNote': None,
                                     'rootOctave': None,
                                     'rootPitch': None,
                                     'scale': None,
                                     'songId': '5676759593254912',
                                     'student_name': 'Lilly G.',
                                     'subdivision': None,
                                     'tempo': None}]}],
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

    def add_gallery(self, *, song_data=None):
        full_data = self.mock_api_data
        if song_data:
            full_data['song_groups'] = song_data
        serializer = GallerySerializer(
            data=full_data,
            context={'request': SimpleNamespace(user=self.user)}
        )
        if serializer.is_valid():
            return serializer.save()
        self.fail(serializer.errors)
