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
echo "SECRET_KEY = 'randomstr'" > django_smg/django_smg/settings/secret.py
echo "MYSQL_PASSWORD = 'passwd'" >> django_smg/django_smg/settings/secret.py
echo "MYSQL_USER = 'songmaker'" >> django_smg/django_smg/settings/secret.py
echo "MYSQL_NAME = 'songmaker'" >> django_smg/django_smg/settings/secret.py
echo "EMAIL_HOST_USER = 'deveml'" >> django_smg/django_smg/settings/secret.py
echo "EMAIL_HOST_PASSWORD = 'deveml'" >> django_smg/django_smg/settings/secret.py


# append env variable to ~/.bashrc
echo "# Config for Song Maker Gallery" >> ~/.bashrc
echo "DJANGO_DEBUG=\"true\"" >> ~/.bashrc

echo "SMG SETUP: Creating virtual environment..."
cd django_smg
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "SMG SETUP: performing django database migration on new sqlite database"
python manage.py migrate

echo "SMG SETUP: Running python test suite"
python manage.py test

echo "SMG SETUP: Installing javascript dependencies"
cd frontend
npm install

echo "SMG SETUP: Running frontend test suite"
npm run test

echo "SMG SETUP: Building frontend"
npm run build

echo "SMG SETUP: Starting server"
cd ..
python -c "import webbrowser; webbrowser.open('http://localhost:8000')"
exec python manage.py runserver

echo "!!!--PLEASE RESTART YOUR TERMINAL TO APPLY ENVIRONMENT VARIABLES--!!!"
