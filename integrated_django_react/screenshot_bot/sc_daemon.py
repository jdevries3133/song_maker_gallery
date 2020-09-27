#!/home/ubuntu/main/venv/bin/python3.8

from datetime import datetime
import logging
import json
import os
from time import sleep
import sys
import requests
from django.core.mail import send_mail
import django
from bot.take_screenshots import take_screenshots
from bot.models import ToDo

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
CONFIG_PATH = os.path.join(BASE_DIR, 'screenshot_bot', 'config.json')
with open(CONFIG_PATH, 'r') as jsn:
    env = json.load(jsn)
    for k, v in env.items():
        os.environ.setdefault(k, v)
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'screenshot_bot.settings')
django.setup()

# imports that need django setup first

BACKEND_POST_URL = os.getenv('BACKEND_URL') + 'api/screenshot/partial-update/'
logger = logging.getLogger('file_logger')


def email(subject, message):
    # email confirmation that screenshots are ready
    from_email = 'songmakergallery@gmail.com'
    recipient_list = ['jdevries3133@gmail.com']
    send_mail(
        subject,
        message,
        from_email,
        recipient_list
    )


def main():
    while True:
        todo = ToDo.objects.all()
        if todo:
            logger.info(
                'Beginning to process galleries:\n\n'
                + str([i.url_extension + '\n' for i in todo])
            )
            start_time = datetime.now()
            for index, gallery in enumerate(todo):
                logger.debug('test of daemon logging')
                # check that current running time is > 4hrs
                # if running time > 4hrs, set off critical error; bot is
                # overwhelmed
                delta = datetime.now() - start_time
                if delta.seconds > 28800:
                    email(
                        'CRITICAL: Screenshot Bot has been running nostop for 4 hours; may be overloaded!',
                        'The screenshot bot has been taking screenshots '
                        'nonstop for four hours. This may mean that there '
                        'is a critical overflow of galleries to do; customers '
                        'at the end of the queue have been waiting for at least '
                        'four hours. Provision additional screenshot bots '
                        'immediately.\n\n\n '
                        f'Galleries todo at start of loop:\t{len(todo)}\n\n'
                        f'Galleries completed:\t\t{index}'
                        f'Galleries remaining:\t\t{len(todo) - index}'
                    )
                    logger.critical(
                        'Screenshot bot has been running for 1 hour continuously '
                        'and is still running. This represents a severe '
                        'overload of jobs. Work to scale up!'
                    )
                data = take_screenshots(gallery)
                jsn = json.dumps(data)
                res = requests.patch(
                    BACKEND_POST_URL,
                    headers={
                        'Authorization': f'Token {os.getenv("CUSTOM_AUTH_TOKEN")}',
                        'Content-Type': 'application/json',
                    },
                    data=jsn,
                )
                if res.status_code == 200:
                    logger.info(f'Job posted to SC Bot: {data["pk"]}')
                    todo.delete()
                else:
                    breakpoint()
                    logger.error(f'Backend failed to recieve {data}')
            end_time = datetime.now()
            delta = end_time - start_time
            if delta.seconds > 3600:
                email(
                    'WARN: Screenshot Bot Cycle Finished > 1 Hour',
                    'WARN: Screenshot Bot just finished a run cycle that took '
                    'greater than one hour.\n\nConsider provisioning more '
                    'screenshot bot instances.'
                )
        else:
            logger.debug('Daemon waiting for gallery...')
            sleep(10)


if __name__ == '__main__':
    main()
