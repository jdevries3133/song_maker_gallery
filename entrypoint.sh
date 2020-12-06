#!/bin/sh

python wait_for_db.py
python manage.py migrate --no-input
python manage.py collectstatic --no-input
python init_django.py

exec gunicorn integrated_django_react.wsgi:application --bind 0.0.0.0:8000
