import logging
import json
import os
from rest_framework.renderers import JSONRenderer
from django_cron import CronJobBase, Schedule
import requests
from .models import ToDo
from .take_screenshots import take_screenshots

BACKEND_POST_URL = os.getenv('BACKEND_URL') + 'api/screenshot/partial-update/'
logger = logging.getLogger('file')

class ScreenshotterCron(CronJobBase):
    RUN_EVERY_MINS = 60
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'bot.cron'

    def do(self):
        todo = ToDo.objects.all()
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

