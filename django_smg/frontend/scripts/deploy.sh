#!/bin/bash

rm static/frontend/webpack_output/*
source ../venv/bin/activate
npm run build
scp static/frontend/webpack_output/* ubuntu@ec2:/home/ubuntu/song_maker_gallery/django_smg/static_root/frontend/webpack_output/
scp static/frontend/webpack_output/* ubuntu@ec2:/home/ubuntu/song_maker_gallery/django_smg/frontend/static/frontend/webpack_output/
