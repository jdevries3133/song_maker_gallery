"""
Perform database migrations and create superuser after database is available.
"""
import json
import string
from random import randint
import os
from time import sleep
import subprocess
import sys

from django import setup as django_setup

BASE_DIR = os.path.dirname(__file__)
CONFIG_PATH = os.path.join(BASE_DIR, 'django_smg', 'config.json')
with open(CONFIG_PATH, 'r') as jsn:
    env = json.load(jsn)
    for k, v in env.items():
        os.environ.setdefault(k, v)
sys.path.append(BASE_DIR)
os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'django_smg.settings'
)
django_setup()

from django.contrib.auth.models import User
from django.db import connection
from django.core.management import call_command
from django.db.utils import DatabaseError, IntegrityError
from teacher_admin.models import Gallery


def migrate():
    i = 0
    while True:
        try:
            connection.ensure_connection()
            call_command('migrate', interactive=False)
            break
        except DatabaseError:
            print(
                f'Database not yet available after {i} attempt(s). Waiting 5 '
                'seconds to try again.'
            )
            sleep(5)
            i += 1


def create_superuser():
    creds = {
        'username': os.getenv('DJANGO_SUPERUSER_USERNAME'),
        'email': os.getenv('DJANGO_SUPERUSER_EMAIL'),
        'password': os.getenv('DJANGO_SUPERUSER_PASSWORD'),
    }
    for val in creds.values():
        if not val:
            print(
                'WARN: All required superuser credentials not provided. '
                'Superuser will not be created or updated'
            )
            return
    try:
        User.objects.create_superuser(**creds)
    except IntegrityError:
        print('updating user')
        # superuser already exists, just update credentials
        user = User.objects.get(username=creds.get('username'))
        user.email = creds.get('email')
        user.password = creds.get('password')
        user.save()

def create_default_gallery():
    with open('teacher_admin/sample_gallery.json', 'r') as jsn:
        api_obj = json.load(jsn)
    # random anon user that the default gallery will belong to
    user = User.objects.create(
        username='anon_galler',
        email='jdevries3133@gmail.com',
        password=''.join(
            string.printable[:84][randint(0, 83)] for i in range(20)
        )
    )
    Gallery.objects.create(
        owner=user,
        title='Sample Gallery',
        description=(
            'This is an example of what one of our galleries look like. You '
            'enter your own title, put your own description here, and enter '
            'the names for your groups of students in whatever way makes sense '
            'to you. We automatically take screenshots of your students\' '
            'work, and put together this beautiful gallery to put their '
            'talents on display!'
        ),
        api_obj=api_obj,
        url_extension="sample-gallery"
    ).save()


def main():
    migrate()
    create_superuser()
    create_default_gallery()


if __name__ == '__main__':
    main()
