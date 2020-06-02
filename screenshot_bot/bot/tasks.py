from __future__ import absolute_import, unicode_literals
from celery import shared_task
from .take_screenshots import ScreenshotTaker

@shared_task
def screenshots(galleries):
    screenshotter = ScreenshotTaker(galleries)
    updated_galleries = screenshotter.multithread_cron()