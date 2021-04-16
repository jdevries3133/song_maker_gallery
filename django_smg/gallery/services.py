import logging


import requests

from django.conf import settings
from django.db.models.query import QuerySet

from .models import Song


# sometimes, placeholder data has to be thrown in if we get a bad api response.
mock_data = {
    "bars": 1,
    "beats": 4,
    "instrument": "piano",
    "octaves": 2,
    "percussion": "electronic",
    "percussionNotes": 2,
    "rootNote": 48,
    "rootOctave": 4,
    "rootPitch": 0,
    "scale": "major",
    "subdivision": 2,
    "tempo": 91,
}


logger = logging.getLogger(__name__)

def iter_fetch_and_cache(*, songs: QuerySet):
    """
    Fetch and cache data for a currently uncached song.
    """
    needs_update = False
    session1 = requests.Session()
    session2 = requests.Session()
    for song in songs:
        if song.is_cached:
            yield song
            continue

        needs_update = True
        SONG_JSON_DATA = lambda song_id : (
            f'https://musiclab.chromeexperiments.com/Song-Maker/data/{song_id}'
        )
        SONG_MIDI_FILE = lambda song_id : (
            f'https://storage.googleapis.com/song-maker-midifiles-prod/{song_id}.mid'
        )
        try:
            json_data = session1.post(SONG_JSON_DATA(song.songId)).json()
        except ValueError:
            # Put placeholder data such that the song appears blank.
            for k, v in mock_data.items():
                setattr(song, k, v)
            song.midi = b''
            song.is_cached = True
            logger.error(
                f'Failed to get data for {song.student_name}\'s song with songId: {song.songId}'
            )
            yield song
            continue
        midi_bytes = session2.get(SONG_MIDI_FILE(song.songId)).content
        for k, v in json_data.items():
            setattr(song, k, v)
        song.midi = midi_bytes  # type: ignore 
        song.is_cached = True  # type: ignore
        yield song
    if needs_update:
        Song.objects.bulk_update(songs, [  # type: ignore
            'midi',
            'is_cached',
            'beats',
            'bars',
            'instrument',
            'octaves',
            'percussion',
            'percussionNotes',
            'rootNote',
            'rootOctave',
            'rootPitch',
            'scale',
            'subdivision',
            'tempo',
        ])
