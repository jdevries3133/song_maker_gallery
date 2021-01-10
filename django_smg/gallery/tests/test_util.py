from copy import deepcopy
import json
from unittest import TestCase

from .util import are_rendered_groups_same
from .base_case import GalleryTestCase


class TestRenderedGroupsAreSame(TestCase):
    """
    g1 == g2
    g1 != others

    Find the diff in each of the others by looking for the comment
    # DIFF
    """
    def setUp(self):
        self.others = [
                {
                'title': 'other title',  # DIFF
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
            },
            {
                'title': 'Test Title',
                'description': 'This is the test description.',
                'songData': [
                    [
                        [
                            'Mark Johnson',
                            'https://musiclab.chromeexperiments.com/Song-Maker/'
                            'song/461834650632704',  # DIFF (one number)
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
            },
            {
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
                        'different group',  # DIFF
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
        ]

    def test_same_post_data_recognized_as_such(self):
        data = deepcopy(GalleryTestCase.mock_api_data)
        data['songData'] = json.loads(data['songData'])
        self.assertTrue(are_rendered_groups_same(data, data))

    def test_same_rendered_gallery_recognized_as_such(self):
        self.assertTrue(are_rendered_groups_same(
            GalleryTestCase.expected_rendered_data,
            GalleryTestCase.expected_rendered_data
        ))

    def test_different_title_identified(self):
        different = deepcopy(GalleryTestCase.expected_rendered_data)
        different['title'] = 'dif'
        self.assertFalse(are_rendered_groups_same(
            GalleryTestCase.expected_rendered_data,
            different
        ))

    def test_different_description_identified(self):
        different = deepcopy(GalleryTestCase.expected_rendered_data)
        different['description'] = 'dif'
        self.assertFalse(are_rendered_groups_same(
            GalleryTestCase.expected_rendered_data,
            different
        ))

    def test_different_midi_identified(self):
        different = deepcopy(GalleryTestCase.expected_rendered_data)
        different['songData'][1][0]['midiBytes'] = '7'
        self.assertFalse(are_rendered_groups_same(
            GalleryTestCase.expected_rendered_data,
            different
        ))

    def test_different_name_identified(self):
        different = deepcopy(GalleryTestCase.expected_rendered_data)
        different['songData'][1][2]['name'] = 'Craig'
        self.assertFalse(are_rendered_groups_same(
            GalleryTestCase.expected_rendered_data,
            different
        ))

    def test_different_beats_identified(self):
        different = deepcopy(GalleryTestCase.expected_rendered_data)
        different['songData'][0][1]['metadata']['beats'] = 7
        self.assertFalse(are_rendered_groups_same(
            GalleryTestCase.expected_rendered_data,
            different
        ))

    def test_comparison_of_different_types_raises_exception(self):
        data = deepcopy(GalleryTestCase.mock_api_data)
        data['songData'] = json.loads(data['songData'])
        with self.assertRaises(Exception):
            are_rendered_groups_same(
                data,
                GalleryTestCase.expected_rendered_data
            )

    def test_all_others_return_false(self):
        data = deepcopy(GalleryTestCase.mock_api_data)
        data['songData'] = json.loads(data['songData'])
        for other in self.others:
            self.assertFalse(are_rendered_groups_same(
                data,
                other
            ))
