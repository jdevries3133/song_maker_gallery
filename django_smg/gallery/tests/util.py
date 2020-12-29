def are_rendered_groups_same(r1: dict, r2: dict) -> bool:
    # r => "rendered"
    if r1.get('title') != r2.get('title'):
        return False

    if r1.get('description') != r2.get('description'):
        return False

    # g => "group"
    for g1, g2 in zip(r1.get('songData'), r2.get('songData')):

        if g1[-1] != g2[-1]:
            return False
        # s => "student"
        for st1, st2 in zip(g1[:-1], g2[:-1]):
            for i1, i2 in zip(st1, st2):
                if i1 != i2:
                    return False
    return True
