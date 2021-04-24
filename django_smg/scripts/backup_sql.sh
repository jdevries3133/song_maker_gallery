# Script to create simple sql backups as sqldumps on disk

# TODO: make this into a python script that can be called from any working
# directory and has no hard coded paths

cd /home/ubuntu/song_maker_gallery/django_smg
source venv/bin/activate
python manage.py dumpdata > "sqldumps/$(date +"%FT%T").json"
