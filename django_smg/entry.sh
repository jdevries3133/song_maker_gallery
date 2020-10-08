#!/bin/bash

python init_django.py
exec python manage.py runserver 0.0.0.0:8000
