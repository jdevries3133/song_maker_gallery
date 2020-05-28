#!/bin/bash

installed_python=$(ls /usr/local/bin | grep "^python\d.\d$" | sort | tail -n 1)
installed_npm=$(which npm)

if [ $installed_python != "python3.8" ]; then
    echo "Warning: This project was designed for python3.8. Press enter to continue build with $python_version"
    read
fi
if [ $installed_npm == "No such file or directory" ]; then
    echo "Error: npm must be installed for this script to run."
    exit 1
fi

/usr/local/bin/$installed_python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd integrated_django_react/frontend
npm install
npm run build

cd ..
sleep 2
open http://127.0.0.1:8000
python manage.py runserver
exit 0
