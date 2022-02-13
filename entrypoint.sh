#!/bin/sh

# Production entrypoint.

python3 manage.py migrate --no-input

exec python -m gunicorn \
    --access-logfile - \
    --workers 3 \
    --bind 0.0.0.0:8000 \
    django_smg.wsgi:application
