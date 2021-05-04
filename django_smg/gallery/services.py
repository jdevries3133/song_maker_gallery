import re
import logging
from typing import Any
import json

import requests
from django.conf import settings
from django.db.models.query import QuerySet
from rest_framework.exceptions import ValidationError
from rest_framework import serializers

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


def fetch_and_cache(*, songs: QuerySet):
    """
    Fetch and cache data for a currently uncached song.
    """
    needs_update = False
    session1 = requests.Session()
    session2 = requests.Session()

    copies = {
        copy.songId: copy for copy in Song.objects.filter(
        songId__in=[s.songId for s in songs],
        is_cached=True
    )}

    for song in songs:

        if song.is_cached:
            continue

        needs_update = True

        if song.songId in copies:
            # we already have this song in our database! Copy these attributes
            # from the duplicate to the new song
            for key in [
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
            ]:
                setattr(song, key, getattr(copies[song.songId], key))
            continue

        def SONG_JSON_DATA(song_id): return (
            f'https://musiclab.chromeexperiments.com/Song-Maker/data/{song_id}'
        )

        def SONG_MIDI_FILE(song_id): return (
            'https://storage.googleapis.com/song-maker-midifiles-prod/'
            f'{song_id}.mid'
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
            continue
        midi_bytes = session2.get(SONG_MIDI_FILE(song.songId)).content
        for k, v in json_data.items():
            setattr(song, k, v)
        song.midi = midi_bytes  # type: ignore
        song.is_cached = True  # type: ignore
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
    return songs


def normalize_student_name(name: str):
    """
    Try our very best to store names as first name, last initial.
    """
    name = name.strip()  # thanks Wendy!
    name_parts = [i for i in name.split(' ') if i]
    if len(name_parts) > 1:
        name = (
            name_parts[0].title()
            + ' '
            + name_parts[-1][0].upper() + '.'
        )
    else:
        if name_parts:
            name = name_parts[0]
        else:
            name = ''
    return name


def normalize_songId(songId: Any) -> str:
    """
    Cast to a string if it is not already and if possible.
    """
    if not isinstance(songId, str):
        try:
            return str(songId)
        except (TypeError, ValueError):
            raise ValidationError(
                'Could not interpret {songId} as a string'
            )
    return songId
