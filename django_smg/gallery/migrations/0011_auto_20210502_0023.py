# Generated by Django 3.2 on 2021-05-02 00:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    """
    I am setting the default owner to userId #2 here. That is *my* userId,
    but anyone else happens to deploy this site on a new database, you
    better hope you have control over userId #2 :)
    """

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('gallery', '0010_auto_20210501_2348'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='owner',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, related_name='songs', to='auth.user'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='songgroup',
            name='owner',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, related_name='song_groups', to='auth.user'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='gallery',
            name='owner',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, related_name='galleries', to='auth.user'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='songgroup',
            name='gallery',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='song_groups', to='gallery.gallery'),
        ),
    ]
