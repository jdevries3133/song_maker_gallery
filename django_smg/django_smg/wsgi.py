"""
WSGI config for django_smg project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os
import json

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_smg.settings')

# My env variables
# Hopefully will achieve successfully in settings.py now, so the dev server uses
# the same config file
# CONFIG_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'config.json')
# with open(CONFIG_PATH, 'r') as jsn:
#     env = json.load(jsn)
#     for k, v in env.items():
#         os.environ.setdefault(k, v)

application = get_wsgi_application()
