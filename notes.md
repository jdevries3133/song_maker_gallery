# TODO

[x] Remove old garbage code
[ ] Rewrite database migrations to handle new data

# Things to think about later

- Song model objects have a ManyToMany relationship to both galleries and
    SongGroups. It will therefore be necessary to prune songs that are not
    linked to anything anymore.
