"""
WSGI config for integrated_django_react project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os
import json

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'integrated_django_react.settings')

# My env variables
with open('/home/ubuntu/main/integrated_django_react/integrated_django_react/config.json', 'r') as jsn:
    env = json.load(jsn)

    for k, v in env.items():
        os.environ.setdefault(k, v)

application = get_wsgi_application()
