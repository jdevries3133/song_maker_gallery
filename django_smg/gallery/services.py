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

    for song in songs:

        if song.is_cached:
            continue

        needs_update = True

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


def depr_validate_spreadsheet_data(data):
    if isinstance(data, str):
        data = json.loads(data)
    elif isinstance(data, dict) and isinstance(data.get('songData'), str):
        data = json.loads(data.get('songData'))  # type: ignore
    assert isinstance(data, list)

    validation_errors = []

    try:
        group_names = set()
        for group in data:
            if group[-1] in group_names:
                validation_errors += [
                    'Spreadsheet data is not valid',
                    f'Two spreadsheets named {group[-1]} are not allowed.'
                    'Group names must be unique.'
                ]
                continue
            group_names.update(group[-1])
            for rownum, row in enumerate(group[:-1], start=1):
                row = [r for r in row if r]
                if not row:
                    validation_errors.append(
                        f'The spreadsheet for the group, "{group[-1]}," '
                        f'row {rownum} is empty'
                    )
                    continue
                if len(row) != 2:
                    validation_errors += [
                        f'Row #{rownum} of the spreadsheet for your '
                        f'group, "{group[-1]}," does not contain two items. '
                        f'Instead, it contains: "{", ".join(row)}".'
                    ]
                    continue
                if not re.match(
                    r'http(s)?://musiclab.chromeexperiments.com/Song-Maker/'
                    r'song/(\d){16}',
                    row[1].strip()
                ):
                    validation_errors += [
                        'An error occured while parsing the spreadsheet '
                        f'for your group named, "{group[-1]}." '
                        f'The Song Maker link for {row[0]} ({row[1]}) is '
                        f'not valid. (row #{rownum})'
                    ]
    except Exception as e:
        logger.exception(f'Validation failed due to error: {e}')
        logger.error(f'songData: {data}')
        validation_errors.append('Invalid spreadsheet data.')
    if validation_errors:
        raise serializers.ValidationError(validation_errors)
    return data
