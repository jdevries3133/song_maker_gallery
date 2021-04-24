# Contribution guide for the Song Maker Gallery

## Welcome!!

Not only is this a free and open source project, I also strive to keep
as much of the site itself free to users for as long as possible. Any revenue
from the website will always directly support the site's long-term operation,
or be donated to good causes within music education as I see fit.

Best of all, this project is lead by a teacher and programming hobbyist! If
you are interested in open source contributing, there couldn't be a better
place to start!

### Code of Conduct

This project follows the
[Contributor's Covenant](https://www.contributor-covenant.org/version/2/0/code_of_conduct/)
and I wil approach every contribution, big or small with extrordinary
gratitude and support.

## About the Project & What is Next

Since launching in February 2021, this site has gained hundreds of music
teacher users, and serves thousands of students. The site also continues
to grow organically through word of mouth, and version 3 features detailed
in #34 (new wireframes) are sure to bring many more users to the site.

Speaking of #34, this is the next big priority for development now. The
wireframes there show how to implement #10 (student link uploads) and #11
(social galleries) as well.

## [#34](https://github.com/jdevries3133/song_maker_gallery/issues/34)

If you would like to get going on implementing a wireframe for #34, that is
fantastic! Take a look at
[the issue](https://github.com/jdevries3133/song_maker_gallery/issues/34)
before you start so that you know where to put what!

# Development Setup

> Run `bash scripts/dev_setup.sh` to do all these steps automatically. Beware
> that it will append to your `~/.bashrc`.

### Django

> The project's backend is a REST API built with the
> [Django Rest Framework.](https://www.django-rest-framework.org/)

1. Create the file `django_smg/django_smg/secret_settings.py`.
2. Define the `SECRET_KEY` variable in this file. Set it to any string your
   heart desires
3. Set the environment variable `DJANGO_DEBUG` to any non-zero value
   - Set to any truthy value: `true`, `1`, etc...
   - This `DEBUG` to be set to `True` inside Django and causes project to use
     sqlite.
4. "cd" into the django_smg folder (`cd django_smg`)
5. Create a virtual environment `python3 -m venv venv`
6. Activate the environment (`source venv/bin/activate` for unix/linux)
7. Install dependencies: `pip install -r requirements.txt`
8. Perform database migrations. dbsqlite is used for development:
   `python manage.py migrate`
9. Use manage.py to see if everything is ok: `python manage.py check`
10. Run tests, make sure they all pass: `python manage.py test`
    - log output will be automatically supressed during testing by using the
      settings file at `django_smg/django_smg/test_settings.py`. Comment out
      lines 20 and 21 in `django_smg/manage.py` to change that behavior.

### React / Frontend

> The entire frontend is built with React JS. It is nestled within and
> served by the django project.

1. Change to the base directory for the frontend, where the `package.json` file
   lives: `cd django_smg/frontend`
2. Install Node modules `npm install`
3. Webpack can watch the frontend source and re-bundle on save for development:
   `npm run dev`
4. Since the frontend is served by django. start the django development server
   to get the frontend to the browser.

```bash
 source django_smg/venv/bin/activate
 python django_smg/manage.py runserver
```

5. Now, the frontend should appear in the browser at `localhost:8000`. Any
   change to a frontend src file will trigger webpack to update the JS bundle,
   and you will see the changes in effect by hitting refresh.

**Storybook**

[Storybook](https://storybook.js.org/docs/react/get-started/introduction)
is a platform for developing UI components in isolation. Anytime you are
working on laying out or styling a single component, this is the best way to
do it. Storybook is already set up for this project, and quite easy to use. To
get started, just run `npm run storybook`. See their docs or examples in this
repo for how to write stories to bring new components into the storybook.

### Approaching the UI As a User

Take a look at the csv file in the `ui_testing_data` folder. This is an example
of what the user should upload for each group to make their gallery. This
is currently the only way for the user to create a gallery, but more user
friendly means for making galleries is on the feature roadmap
([#10](https://github.com/jdevries3133/song_maker_gallery/issues/10)).

# Code Style

## Python

- Follow PEP8.
- 80 chars per line (religiously)
  - I know that is not everyone's preference
  - I do it because it allows me to be able to vertically split 3 files at a
    nice font size on my monitor, and make the most of screen real estate in
    general.
- Indent with 4 spaces.
- Use type annotations when it makes sense to do so! Consider using a static
  type checker (I use pyright).

Exemplary use of parenthesis to flow statements across multiple lines:

```python
return Response(
    GallerySerializer(
        request.user.gallery.all(),
        many=True
    ).data
)

for song in iter_fetch_and_cache(
    songs=Song.objects.filter(  # type: ignore
        id__in=data['songs'],
        group=group
    )
):
```

## Javascript

Use prettier.

- I use 100% default settings
- 80 char line limit
  - _I know that sometimes prettier pushes lines a few characters over;_
    _that is ok._
