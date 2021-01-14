import requests

from django.conf import settings
from django.db.models.query import QuerySet


def iter_fetch_and_cache(*, songs: QuerySet):
    """
    Fetch and cache data for a currently uncached song.
    """
    session1 = requests.Session()
    session2 = requests.Session()
    for song in songs:
        if song.is_cached:
            yield song
            continue
        if settings.SKIP_FETCH_AND_CACHE:
            song.midi = b''  # type: ignore
            song.is_cached = True  # type: ignore
            song.save()
            yield song
            continue
        SONG_JSON_DATA = lambda song_id : (
            f'https://musiclab.chromeexperiments.com/Song-Maker/data/{song_id}'
        )
        SONG_MIDI_FILE = lambda song_id : (
            f'https://storage.googleapis.com/song-maker-midifiles-prod/{song_id}.mid'
        )
        json_data = session1.post(SONG_JSON_DATA(song.songId)).json()
        midi_bytes = session2.get(SONG_MIDI_FILE(song.songId)).content
        for k, v in json_data.items():
            setattr(song, k, v)
        song.midi = midi_bytes  # type: ignore 
        song.is_cached = True  # type: ignore
        song.save()
        yield song
