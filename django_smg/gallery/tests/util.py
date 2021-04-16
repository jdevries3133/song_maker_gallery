import logging

logger = logging.getLogger(__name__)

# TODO: this function is cursed and enormous. Break up into smaller parts.
# alternatively, since it is basically just a deep strict equality operation,
# find an established way to do it other than this hack.
def are_rendered_groups_same(r1: dict, r2: dict, strict_midibytes: bool=True
                             ) -> bool:
    """
    This is a helper function for testing to determine if data structures
    frequently used to describe galleries are recursively the same. The code
    is very confusing. Look to the tests for a clearer understanding of what
    this does.

    If strict_midibytes is set to False, we do not care if the python datatype
    is string or bytes, only that they have the same value.
    """
    # r => "rendered"
    if r1.get('title') != r2.get('title'):
        logger.error('Titles are not the same')
        return False

    if r1.get('description') != r2.get('description'):
        logger.error('Descriptions are not the same')
        return False

    # g => "group"
    for i in range(max(len(r1.get('songData')), len(r2.get('songData')))):
        try:
            g1 = r1['songData'][i]
            g2 = r2['songData'][i]
        except (KeyError, IndexError):
            logger.error('songData group lengths do not match')
            return False
        # s => "student"
        if isinstance(g1[0], dict) and isinstance(g2[0], dict):
            for i in range(max(len(g1[:-1]), len(g2[:-1]))):
                try:
                    st1 = g1[i]
                    st2 = g2[i]
                except IndexError:
                    logger.error(f'Student groups don\'t match on group # {i}')
                    return False
                try:
                    for k in ['name', 'songId', 'midiBytes']:
                        if st1[k] != st2[k]:


                            if not strict_midibytes:
                                cmp1 = None
                                cmp2 = None

                                # coerce type of st1[k]
                                if isinstance(st1[k], str):
                                    cmp1 = bytes(st1[k], 'utf8')
                                elif isinstance(st1[k], bytes):
                                    cmp1 = st1[k]
                                else:
                                    raise TypeError(f'Cannot coerce comparison between {st1[k]} and {st2[k]}')

                                # coerce type of st2[k]
                                if isinstance(st2[k], str):
                                    cmp2 = bytes(st2[k], 'utf8')
                                elif isinstance(st2[k], bytes):
                                    cmp2 = st2[k]
                                else:
                                    raise TypeError(f'Cannot coerce comparison between {st1[k]} and {st2[k]}')

                                # finally, make comparison
                                if cmp1 == cmp2:
                                    continue


                            logger.error(
                                f'Name, songId, or midiBytes are not the same'
                            )
                            return False
                    for k in st1['metadata']:
                        if st1['metadata'][k] != st2['metadata'][k]:
                            logger.error(
                                f'Metada item {k} was not the same for these '
                                'students:\n\t{st1}\n\t{st2}'
                            )
                            return False
                except KeyError:
                    logger.error(
                        'Key error while iterating through students'
                    )
                    return False
        elif isinstance(g1[0], list) and isinstance(g2[0], list):
            for i in range(max(len(g1[:-1]), len(g2[:-1]))):
                try:
                    st1 = g1[i]
                    st2 = g2[i]
                except IndexError:
                    logger.error('Groups are not the same length')
                    return False
                for i in range(max(len(st1), len(st2))):
                    try:
                        i1 = st1[i]
                        i2 = st2[i]
                    except IndexError:
                        logger.error('Student lists are not the same length')
                        return False
                    if i1 != i2:
                        logger.error(
                            f'Item mismatch between student {st1} and student '
                            f'{st2}.\n\t{i1} != {i2}.'
                        )
                        return False
        else:
            raise Exception(
                'Cannot compare groups of mixed type. Can compare api request '
                'data to other api request data or rendered data to other '
                'rendered data, but not api request data to rendered data.'
            )
        if g1[-1] != g2[-1]:
            logger.error('Group names are not the same')
            return False
    return True
