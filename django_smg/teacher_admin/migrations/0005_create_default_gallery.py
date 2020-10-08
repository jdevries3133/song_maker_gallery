# Create the default gallery that the landing page depends on.
from random import randint
import string
import json
from django.db import migrations


def create_sample_gallery(apps, schema_editor):
    Gallery = apps.get_model('teacher_admin', 'Gallery')
    User = apps.get_model('auth', 'User')
    with open('teacher_admin/sample_gallery.json', 'r') as jsn:
        api_obj = json.load(jsn)
    # random anon user that the default gallery will belong to
    user = User.objects.create(
        username='anon_galler',
        email='jdevries3133@gmail.com',
        password=''.join(
            string.printable[:84][randint(0, 83)] for i in range(20)
        )
    )
    Gallery.objects.create(
        owner=user,
        title='Sample Gallery',
        description=(
            'This is an example of what one of our galleries look like. You '
            'enter your own title, put your own description here, and enter '
            'the names for your groups of students in whatever way makes sense '
            'to you. We automatically take screenshots of your students\' '
            'work, and put together this beautiful gallery to put their '
            'talents on display!'
        ),
        api_obj=api_obj
    )


class Migration(migrations.Migration):

    dependencies = [
        ('teacher_admin', '0004_gallery_work_in_progress'),
    ]

    operations = [
        migrations.RunPython(create_sample_gallery)
    ]
