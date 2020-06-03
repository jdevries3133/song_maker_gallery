from concurrent.futures import ThreadPoolExecutor
from django_cron import CronJobBase, Schedule
from .models import ToDo
from .take_screenshots import take_screenshots


class ScreenshotterCron(CronJobBase):
    RUN_EVERY_MINS = 5
    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'bot.cron'

    def do(self):
        todo = ToDo.objects.all()
        for i in todo:
            take_screenshots(i)
        # with ThreadPoolExecutor as executor:
        #     executor.map(take_screenshots, todo)
