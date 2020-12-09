# Ensure that I don't push with debug set to true

from integrated_django_react.integrated_django_react.settings import DEBUG

if DEBUG:
    raise Exception

from screenshot_bot.screenshot_bot.settings import DEBUG

if DEBUG:
    raise Exception
