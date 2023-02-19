#!/bin/sh


npm install --global concurrently

concurrently \
    'cd frontend && npm run dev' \
    'python3 manage.py migrate; python3 manage.py runserver 0.0.0.0:8000'"
