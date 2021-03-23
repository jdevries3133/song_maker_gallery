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
in #34 are sure to bring many more users to the site.

Speaking of #34, this is the next big priority for development now. The
wireframes there show how to implement #10 and #11 as well. Before diving too
deep into #34, though, I want to continue cleaning up the frontend codebase
by working towards #32 (styled-components migration), and continuing to
housekeep around the frontend code in general because it is a bit unfocused
and messy as it is.

## Development Setup

> Run `bash dev_setup.sh` to do all these steps automatically. Beware that it
> will append to your `~/.bashrc`.

### Django

> The project's backend is a REST API built with the
> [Django Rest Framework.](https://www.django-rest-framework.org/)

1. Create the file `django_smg/django_smg/secrets_settings.py`.
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

   source django_smg/venv/bin/activate
   python django_smg/manage.py runserver

5. Now, the frontend should appear in the browser at `localhost:8000`. Any
   change to a frontend src file will trigger webpack to update the JS bundle,
   and you will see the changes in effect by hitting refresh.

### The Teacher Interface

Take a look at the csv file in the ui_testing_data folder. This is an example
of what the user should upload for each group to make their gallery. This
is currently the only way for the user to create a gallery, but more user
friendly means for making galleries is on the feature roadmap (#10, #34).
