# Script to create simple sql backups as sqldumps on disk

cd /home/ubuntu/song_maker_gallery/django_smg
source venv/bin/activate
python manage.py dumpdata > "sqldumps/$(date +"%FT%T").json"
