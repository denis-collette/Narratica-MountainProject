# Generated by Django 5.1.6 on 2025-03-26 10:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Narratica', '0002_bookchapter_chapter_number'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bookchapter',
            name='chapter_number',
        ),
    ]
