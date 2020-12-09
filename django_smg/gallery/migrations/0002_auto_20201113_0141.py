# Generated by Django 3.0.7 on 2020-11-13 01:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='gallery',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='songs', to='gallery.Gallery'),
        ),
        migrations.AlterField(
            model_name='song',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='songs', to='gallery.SongGroup'),
        ),
        migrations.AlterField(
            model_name='songgroup',
            name='gallery',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='song_groups', to='gallery.Gallery'),
        ),
    ]