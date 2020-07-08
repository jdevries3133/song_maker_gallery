#!/home/ubuntu/main/venv/bin/python3.8

import daemon
import logging
import json
import os
from time import sleep
import sys
import django
BASE_DIR = (
    os.path.abspath(
        os.path.join(
            os.path.dirname(
                os.path.dirname(
                    __file__
                )
            )
        )
    )
)
# My env variables
CONFIG_PATH = os.path.join(BASE_DIR, 'screenshot_bot', 'config.json')
with open(CONFIG_PATH, 'r') as jsn:
    env = json.load(jsn)
    for k, v in env.items():
        os.environ.setdefault(k, v)
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'screenshot_bot.settings')
django.setup()

from django_cron import CronJobBase, Schedule
from rest_framework.renderers import JSONRenderer
import requests
from bot.models import ToDo
from bot.take_screenshots import take_screenshots

BACKEND_POST_URL = os.getenv('BACKEND_URL') + 'api/screenshot/partial-update/'
logger = logging.getLogger('file')

class ScreenshotterDaemon:
    def run(self):
        while True:
            todo = ToDo.objects.all()
            if todo:
                for gallery in todo:
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
                        logger.error(f'Backend failed to recieve {data}')
            else:
                sleep(10)

if __name__ == '__main__':
    program = ScreenshotterDaemon()
    with daemon.DaemonContext():
        program.run()
