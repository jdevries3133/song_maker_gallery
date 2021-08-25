import logging

import requests
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



def fetch_and_cache(*, songs: QuerySet):
    """
    Fetch and cache data for a currently uncached song.
    """


    def err_recover(song):
        """
        In the case of bad json data or a network error from the API.
        DOES NOT save the song, because that happens at the very end of this
        function.
        """
        # Put placeholder data such that the song appears blank.
        for k, v in mock_data.items():
            setattr(song, k, v)
        song.midi = b''

        # leaving this False means that we will try to fetch again next time
        song.is_cached = False

    needs_update = False

    # json and midi data are served from separate domains; use separate
    # sessions to get the most out of each handshake; avoid thrashing between
    # them
    json_session = requests.Session()
    midi_session = requests.Session()

    # dirty hack for saving round-trips to google apis. New features like
    # instant song preview thumbnails make it more likely that the data is
    # already in the database. Here, we fetch all the duplicates for the
    # set of songs we are about to process in a single query. That data will
    # be copied over (duplicated) later.

    # TODO: split song relations and song data into separate models so that
    # this data duplication is no longer necessary
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
            # from the duplicate to the new song.
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

        try:
            # fetch json
            uri = (
                'https://musiclab.chromeexperiments.com'
                f'/Song-Maker/data/{song.songId}'
            )
            json_data = json_session.post(uri).json()

            # fetch midi
            uri = (
                'https://storage.googleapis.com'
                f'/song-maker-midifiles-prod/{song.songId}.mid'
            )
            midi_bytes = midi_session.get(uri).content
        except ValueError:
            err_recover(song)
            logger.error(
                f'API data not valid for {song.student_name}\'s song with '
                f'songId: {song.songId}'
            )
            continue
        except IOError:
            err_recover(song)
            logger.error(
                f'Could not fetch data for {song.student_name}\'s song '
                f'(songId: {song.songId})'
            )
            continue

        for k, v in json_data.items():
            setattr(song, k, v)
        song.midi = midi_bytes  # type: ignore
        song.is_cached = True  # type: ignore

    # main loop over. Songs have been mutated; now, perform a single
    # bulk-update query.
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


def normalize_student_name(name: str) -> str:
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
