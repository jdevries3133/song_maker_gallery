# Generated by Django 3.1.4 on 2020-12-28 18:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Gallery",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created", models.DateTimeField(auto_now_add=True)),
                ("title", models.CharField(max_length=100)),
                ("slug", models.SlugField(unique=True)),
                ("description", models.TextField()),
                (
                    "owner",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="gallery",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Gallery",
                "verbose_name_plural": "Galleries",
            },
        ),
        migrations.CreateModel(
            name="SongGroup",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "group_name",
                    models.CharField(max_length=100, verbose_name="Group Name"),
                ),
                (
                    "gallery",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="song_groups",
                        to="gallery.gallery",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Song",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("songId", models.CharField(max_length=20, verbose_name="Song ID")),
                (
                    "student_name",
                    models.CharField(max_length=100, verbose_name="Student Name"),
                ),
                ("isCached", models.BooleanField(default=False)),
                ("bars", models.IntegerField(null=True)),
                ("beats", models.IntegerField(null=True)),
                ("instrument", models.CharField(max_length=50, null=True)),
                ("octaves", models.IntegerField(null=True)),
                ("percussion", models.CharField(max_length=50, null=True)),
                ("percussionNotes", models.IntegerField(null=True)),
                ("rootNote", models.IntegerField(null=True)),
                ("rootOctave", models.IntegerField(null=True)),
                ("rootPitch", models.IntegerField(null=True)),
                ("scale", models.CharField(max_length=50, null=True)),
                ("subdivision", models.IntegerField(null=True)),
                ("tempo", models.IntegerField(null=True)),
                ("midi", models.BinaryField(null=True)),
                (
                    "gallery",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="galleries",
                        to="gallery.gallery",
                    ),
                ),
                (
                    "group",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="song_groups",
                        to="gallery.songgroup",
                    ),
                ),
            ],
        ),
    ]
