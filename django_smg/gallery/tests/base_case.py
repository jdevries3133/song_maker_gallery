import json

from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.test import TestCase, Client

from ..models import Gallery
from ..serializers import GalleryDatasetSerializer


class GalleryTestCase(TestCase):
    mock_api_data =  {
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
    }
    expected_rendered_data = {
        'description': 'This is the test description.',
         'pk': 2,
         'slug': 'test-title-1',
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
                        'midiBytes': 'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4AAJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CBNwAAgTkAsGD/LwA=',
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
                        'midiBytes': 'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4AAJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CBNwAAgTkAsGD/LwA=',
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
                        'midiBytes': 'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4AAJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CBNwAAgTkAsGD/LwA=',
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
                        'midiBytes': 'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4AAJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CBNwAAgTkAsGD/LwA=',
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
                        'midiBytes': 'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4AAJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CBNwAAgTkAsGD/LwA=',
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
                        'midiBytes': 'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4AAJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CBNwAAgTkAsGD/LwA=',
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
                        'midiBytes': 'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4AAJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CBNwAAgTkAsGD/LwA=',
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
                        'midiBytes': 'TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAHIAwQ2lQJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINggT4AAJE+f4NgkT5/AIE+AINgkT5/AIE+AINggT4AAJE+fwCRPH8AkTt/g2CBPgAAgTwAAIE7AACRN38AkTl/g2CBNwAAgTkAsGD/LwA=',
                        'name': 'Lilly G.',
                        'songId': '5676759593254912'},
                       'A Group of Lillys']],
         'title': 'Test Title'
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
        self.gallery = serializer.save()
        return self.gallery
