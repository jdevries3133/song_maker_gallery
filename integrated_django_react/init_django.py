# pylint disable=wrong-import-order
from time import sleep
import logging
import os
import json
import sys

import django

logger = logging.getLogger(__name__)

# Same BASE_DIR as in settings.py. Django is not yet setup in daemon env.
BASE_DIR = (os.path.dirname(os.path.abspath( __file__)))

# setup django and set project env variables from ./integrated_django_react/dev_config.json
CONFIG_PATH = os.path.join(BASE_DIR, 'integrated_django_react', 'dev_config.json')
with open(CONFIG_PATH, 'r') as jsn:
    env = json.load(jsn)
    for k, v in env.items():
        if k == 'SCREENSHOT_BOT_URLS':
            continue
        os.environ.setdefault(k, v)
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'integrated_django_react.settings')
django.setup()

# pylint disable=wrong-import-position
from django.db import connection
from django.contrib.auth.models import User
from teacher_admin.models import Gallery

def main():
    # delete the existing superuser if they exist
    User.objects.filter(username=os.getenv('DJANGO_SUPERUSER_USERNAME')).delete()
    # create superuser passed from env vars, or skip if it already exists.
    usr = User.objects.create_superuser(
        os.getenv('DJANGO_SUPERUSER_USERNAME'),
        os.getenv('DJANGO_SUPERUSER_EMAIL'),
        os.getenv('DJANGO_SUPERUSER_PASSWORD'),
    )

    # create default gallery and assign to the superuser, or skip if it already exists
    with open('/sample_gallery/sample_gallery.json', 'r') as sgal:
        data = json.load(sgal)
        Gallery.objects.create(
            owner=usr,
            title=data['title'],
            description=data['description'],
            api_obj=data['api_obj'],
        )

if __name__ == '__main__':
    main()
