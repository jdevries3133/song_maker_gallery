import requests

from .models import Song


def fetch_and_cache(*, song: Song) -> Song:
    """
    Fetch and cache data for a currently uncached song.
    """
    SONG_JSON_DATA = lambda song_id : (
        f'https://musiclab.chromeexperiments.com/Song-Maker/data/{song_id}'
    )
    SONG_MIDI_FILE = lambda song_id : (
        f'https://storage.googleapis.com/song-maker-midifiles-prod/{song_id}.mid'
    )
    if song.is_cached:
        return song
    json_data = requests.post(SONG_JSON_DATA(song.songId)).json()
    midi_bytes = requests.get(SONG_MIDI_FILE(song.songId)).content
    for k, v in json_data.items():
        setattr(song, k, v)
    song.midi = midi_bytes  # type: ignore 
    song.is_cached = True  # type: ignore
    song.save()
    return song
