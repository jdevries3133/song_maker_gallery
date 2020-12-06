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

def wait_for_db():
    i = 0
    while True:
        try:
            connection.ensure_connection()
            break
        except django.db.utils.DatabaseError:
            logger.info(
                f'Database not yet available after {i} attempt(s). Waiting 5 '
                'seconds to try again.'
            )
            sleep(5)
            i += 1


if __name__ == '__main__':
    wait_for_db()
