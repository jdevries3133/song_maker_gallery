import logging

import requests

from django.conf import settings
from django.db.models.query import QuerySet

from .models import Song

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
        if settings.SKIP_FETCH_AND_CACHE:
            song.midi = b''  # type: ignore
            song.is_cached = True  # type: ignore
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
        except JSONDecodeError:
            logger.error(
                f'Failed to get data for {song.student_name}\'s song with songId: {song.songId}'
            )
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
