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
echo "MYSQL_PASSWORD = 'passwd'" >> django_smg/django_smg/secret_settings.py
echo "MYSQL_USER = 'songmaker'" >> django_smg/django_smg/secret_settings.py
echo "MYSQL_NAME = 'songmaker'" >> django_smg/django_smg/secret_settings.py


echo "\n# Config for Song Maker Gallery" >> ~/.bashrc
echo "DJANGO_DEBUG=\"true\"" >> ~/.bashrc

# setup python environment
cd django_smg
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# setup django project
python manage.py migrate
echo "Running python test suite"
python manage.py test

# setup frontend
echo "Installing javascript dependencies"
cd frontend
npm install
