# Generated by Django 3.1.4 on 2021-01-01 22:14

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("gallery", "0005_auto_20210101_2141"),
    ]

    operations = [
        migrations.AddField(
            model_name="gallery",
            name="created",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
    ]
