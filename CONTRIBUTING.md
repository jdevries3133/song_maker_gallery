# Contribution guide for the Song Maker Gallery

## Welcome!!

**Please take a look at
[issue #66](https://github.com/jdevries3133/song_maker_gallery/issues/66) for
pointers on how to get MySQL going. It is currently necessary due to a bug!**

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
to grow organically through word of mouth, and version 3 features are sure to
bring many more users to the site.

Take a look at current
[issues](https://github.com/jdevries3133/song_maker_gallery/issues)
and [projects.](https://github.com/jdevries3133/song_maker_gallery/projects)

If you want to take an open issue, just leave a comment. I will give you a
detailed writeup on what needs to be done, provide some code scaffolding as
necessary, assign the issue to you, and be available for support while you
work.

# Development Setup

> Run `bash scripts/dev_setup.sh` to do all these steps automatically. Beware
> that it will append to your `~/.bashrc`.

### Django

> The project's backend is a REST API built with the
> [Django Rest Framework.](https://www.django-rest-framework.org/)

The python runtime requires several environment variables:

| Name                  | Description                                    |
| --------------------- | ---------------------------------------------- |
| `SECRET_KEY`          | Django secret, for password hashing, etc.      |
| `POSTGRES_PASSWORD`   | credentials for PostgreSQL connection          |
| `POSTGRES_USER`       | credentials for PostgreSQL connection          |
| `POSTGRES_DB`         | PostgreSQL database name                       |
| `POSTGRES_HOST`       | Host name or IP address for PostgreSQL cluster |
| `EMAIL_HOST_USER`     | email username, hard coded for gmail           |
| `EMAIL_HOST_PASSWORD` | email password, hard coded for gmail           |

### React / Frontend

> The entire frontend is built with React JS. It is nestled within and
> served by the django project.

1. Change to the base directory for the frontend, where the `package.json` file
   lives: `<project_root>/django_smg/frontend`
2. Install node modules: `yarn install`.

# Workflows

Now that you are all setup, depending on what you are doing, there are
different ways for you to proceed.

### `yarn storybook`

> **I am styling or laying out a react component in isolation.**

[Storybook](https://storybook.js.org/docs/react/get-started/introduction)
is a platform for developing UI components in isolation. Anytime you are
working on laying out or styling a single component, this is the best way to
do it. Storybook is already set up for this project, and quite easy to use. To
get started, just run `yarn storybook` from
`<project_root>/django_smg/frontend`. You don't even need to worry about
spinning up the backend here, because you should just be using some mock data.
[Read their docs](https://github.com/jdevries3133/song_maker_gallery/projects)
for more details.

### `yarn test` (and optionally) `--watch`

> **I am developing the frontend or frontend unit tests**

Our frontend unit testing stack is:

- Most Importantly
  - [Jest](https://jestjs.io/)
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- Add-Ons and Utils _it's important to import these into new tests if you are
  doing snapshot tests or want testing-library specific jest matchers to work._
  - [jest-styled-components](https://github.com/styled-components/jest-styled-components)
  - [testing-library/jest-dom](https://github.com/testing-library/jest-dom)

Obviously, I'm often using this in combination with storybook when working
on the frontend, but usually more focused on one or the other depending on
whether the changes are visual or logical.

### `python3 manage.py test`

> **I am working on the backend or backend unit tests**

This will run all the python tests. If you like jest watch mode like
I do, I also have a script to run the tests in a "watch" mode using a command
line tool called [entr](http://eradman.com/entrproject/). After installing entr,
Run the script from inside the `django_smg` folder.

```bash
cd django_smg  # now, you're in <project_root>/django_smg
bash scripts/test_watch.sh [args]  # any args get forwarded into python3 manage.py tests [args]
```

# Code Style

## Python

- Follow PEP8
- 80 chars per line.
- Indent with 4 spaces.
- Use type annotations when it makes sense to do so! Consider using a static
  type checker (I use pyright).

There are different ways to do this, but this is what I consider exemplary use
of parenthesis to flow statements across multiple lines:

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
- approx. 80 character lines
