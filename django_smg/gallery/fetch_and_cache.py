import requests

from .models import Song

SONG_JSON_DATA = lambda song_id : (
    f'https://musiclab.chromeexperiments.com/Song-Maker/data/{song_id}'
)
SONG_MIDI_FILE = lambda song_id : (
    f'https://storage.googleapis.com/song-maker-midifiles-prod/{song_id}.mid'
)


def fetch_and_cache(song: Song):
    """
    Fetch and cache data for a currently uncached song.
    """
    if song.is_cached:
        return
    json_data = requests.post(SONG_JSON_DATA(song.songId)).json()
    midi_bytes = requests.get(SONG_MIDI_FILE(song.songId)).content
    for k, v in json_data.items():
        setattr(song, k, v)
    song.midi = midi_bytes
    song.is_cached = True
    song.save()
