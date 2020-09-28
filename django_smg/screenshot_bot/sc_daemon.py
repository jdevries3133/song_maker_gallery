#!/home/ubuntu/main/venv/bin/python3.8

from datetime import datetime
import json
import logging
import os
from time import sleep
import sys
from django.core.mail import send_mail
import django
from teacher_admin.models import Gallery
from .take_screenshots import take_screenshots

# Same BASE_DIR as in settings.py. Django is not yet setup in daemon env.
BASE_DIR = (
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(
                __file__
            )
        )
    )
)
# setup django and set project env variables from ../screenshot_bot/config.json
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
django.setup()

# imports that need django setup first

logger = logging.getLogger('file_logger')


def email_me(subject, message):
    # email confirmation that screenshots are ready
    from_email = 'songmakergallery@gmail.com'
    recipient_list = ['jdevries3133@gmail.com']
    send_mail(
        subject,
        message,
        from_email,
        recipient_list
    )


def mutate_gallery(gallery):
    data = take_screenshots(gallery.api_obj)
    gallery.api_obj = data
    gallery.needs_screenshot = False
    gallery.work_in_progress = False
    gallery.save()


def main():
    while True:
        todo = Gallery.objects.filter(
            needs_screenshot=True
        ).update(
            work_in_progress=True
        )
        if todo:
            logger.info(
                'Beginning to process galleries:\n\n'
                + str([i.url_extension + '\n' for i in todo])
            )
            for index, gallery in enumerate(todo):
                delta = datetime.now().timestamp() - todo.created.timestamp()
                if delta > 14400:
                    email_me(
                        'CRITICAL: Screenshot Bot has just completed a gallery '
                        f'that was created {delta // 60} hours ago. '
                        'The screenshot bot may be overloaded!',
                        f'Galleries todo at start of loop:\t{len(todo)}\n\n'
                        f'Galleries completed:\t\t{index}'
                        f'Galleries remaining:\t\t{len(todo) - index}'
                    )
                    logger.critical(
                        'Screenshot bot has been running for 1 hour continuously '
                        'and is still running. This represents a severe '
                        'overload of jobs. Work to scale up!'
                    )
                mutate_gallery(gallery)
        else:
            logger.debug('Daemon waiting for gallery...')
            sleep(10)


if __name__ == '__main__':
    main()
