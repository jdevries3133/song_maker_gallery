from django.test import TestCase

from ..models import Song
from ..services import fetch_and_cache
from .base_case import GalleryTestCase

class Test(GalleryTestCase):

    maxDiff = None

    def setUp(self):
        super().setUp()
        self.processed = Song.objects.all().first()  # type: ignore
        fetch_and_cache(song=self.processed)
        self.processed.refresh_from_db()

    def test_song_is_cached(self):
        self.assertTrue(self.processed.is_cached)

    def test_json_data_saved(self):
        expected = {
            'bars': 4,
            'scale': 'major',
            'rootNote': 48,
            'instrument': 'marimba',
            'tempo': 120,
            'beats': 4,
            'percussion': 'electronic',
            'rootOctave': 4,
            'rootPitch': 0,
            'percussionNotes': 2,
            'octaves': 2,
            'subdivision': 2
        }
        for k, v in expected.items():
            self.assertEqual(getattr(self.processed, k), v)

    def test_midi_data_is_saved(self):
        expected = (
            b'MThd\x00\x00\x00\x06\x00\x01\x00\x02\x03\xc0MTrk\x00\x00\x00\x0b'
            b'\x00\xffQ\x03\x07\xa1 \x00\xff/\x00MTrk\x00\x00\x00r\x00\xc1\r'
            b'\xa5@\x91>\x7f\x83`\x91>\x7f\x00\x81>\x00\x83`\x81>\x00\x00\x91'
            b'>\x7f\x83`\x91>\x7f\x00\x81>\x00\x83`\x81>\x00\x00\x91>\x7f\x83'
            b'`\x91>\x7f\x00\x81>\x00\x83`\x91>\x7f\x00\x81>\x00\x83`\x81>'
            b'\x00\x00\x91>\x7f\x00\x91<\x7f\x00\x91;\x7f\x83`\x81>\x00\x00\x81'
            b'<\x00\x00\x81;\x00\x00\x917\x7f\x00\x919\x7f\x83`\x817\x00\x00'
            b'\x819\x00\xb0`\xff/\x00'
        )
        self.assertEqual(
            expected,
            self.processed.midi
        )
