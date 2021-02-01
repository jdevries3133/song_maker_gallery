#!/bin/bash

# Script to setup the development environment as per the Contributing Guide
if [[ $(python3 --version | cut -c 8,10) -ge 38 ]]; then
    echo
else
    echo "python3 version must be greater than or equal to version 3.8."
    echo "Current python version"
    python3 --version
    exit
fi

# setup django secret_settings file
echo "SECRET_KEY = 'randomstr'" > django_smg/django_smg/secret_settings.py
echo "MYSQL_PASSWORD = 'pwd'" >> django_smg/django_smg/secret_settings.py
echo "MYSQL_USER = 'usr'" >> django_smg/django_smg/secret_settings.py
echo "MYSQL_NAME = 'db_name'" >> django_smg/django_smg/secret_settings.py

echo "# Config for Song Maker Gallery" >> ~/.bashrc
echo "DJANGO_DEBUG=\"true\"" >> ~/.bashrc
cd django_smg
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
echo "Running python test suite"
python manage.py test

echo "Installing javascript dependencies"
cd frontend
npm install
