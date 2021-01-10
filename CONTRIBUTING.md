# Contribution guide for the Song Maker Gallery

## Development Setup

### Django

> The project's backend is a REST API built with the
> [Django Rest Framework.](https://www.django-rest-framework.org/)

1. Create the file `django_smg/django_smg/secrets_settings.py`.
2. Define the `SECRET_KEY` variable in this file. Set it to any string your
   heart desires
3. Set the environment variable `DJANGO_DEBUG` to any non-zero value
   - Set to any truthy value: `true`, `1`, etc...
   - This causes django `DEBUG` to be set to `True` and causes project to use
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

   source django_smg/venv/bin/activate
   python django_smg/manage.py runserver

5. Now, the frontend should appear in the browser at `localhost:8000`. Any
   change to a frontend src file will trigger webpack to update the JS bundle,
   and you will see the changes in effect by hitting refresh.

### UI Testing Data / the Teacher Inteface

Take a look at the csv file in the ui_testing_data folder. This is an example
of what the user should upload for each group to make their gallery. Something
to consider in the future is to make the gallery creation interface more user
friendly. One thing that would be fantastic would be to build a submission link
model where students can open up a link their teacher gives them and drop their
MusicLab link into a submision page, which would save the teacher the work
of gathering up the links first.

However, the teacher console component is pure spaghetti code and very
difficult to work on, so the best approach for adding functionality isn't clear.
Overall, I'm not sure if the best thing to do is to get on with it and launch
a working albeit unintuitive version of the project or to develop that feature.

## Roadmap, Current Project State, and TODO Lists

The project is currently in the midst of refactoring from a screenshot-based
approach to a dynamically rendered SVG-based tile. This refactor not only
requires the integration of this "`DynamicTile`" into the frontend, but
a backend architecture to support it as well. The MIDI file and metadata
for each song cannot be requested from google directly in the frontend
because of CORS. As such, a backend is required to fetch, cache, and serve
this information to our frontend.

Currently, the backend basically does everything that it needs to do
including the API for teachers to create new galleries, fetching and caching
song data from Google on the first render request, and an endpoint that the
frontend can hit a single time to get all the information it needs for a single
gallery.

Most of the remaining work is on the frontend involving the integration of
the DynamicTile component. See to-do lists at the following locations for
details:

- `django_smg/TODO.md`: main to-do list
- `django_smg/frontend/src/components/gallery/tilegrid/tilegrid.jsx`:
  DynamicTile-integration-specific to-do list
