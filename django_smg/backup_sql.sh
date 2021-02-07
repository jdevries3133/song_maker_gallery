# Script to create simple sql backups as sqldumps on disk

cd /home/ubuntu/song_maker_gallery/django_smg
source venv/bin/activate
mv sqldumps/dump.sql sqldumps/dump_old.sql
python manage.py dumpdata > sqldumps/dump.json
