from unittest import TestCase

from .util import are_rendered_groups_same


class TestRenderedGroupsAreSame(TestCase):
    """
    g1 == g2
    g1 != others

    Find the diff in each of the others by looking for the comment
    # DIFF
    """
    def setUp(self):
        self.g1 = {
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

        self.g2 = {
            # order of description and title change; should make no difference.
            'description': 'This is the test description.',
            'title': 'Test Title',
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


    def test_same_recognized_as_such(self):
        self.assertTrue(are_rendered_groups_same(self.g1, self.g2))

    def test_all_others_return_false(self):
        for other in self.others:
            self.assertFalse(are_rendered_groups_same(self.g1, other))
