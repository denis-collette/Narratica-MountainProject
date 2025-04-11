# Generated by Django 5.1.7 on 2025-04-11 08:20

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Narratica', '0004_bookchapter_chapter_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='audiobook',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='books', to='Narratica.author'),
        ),
        migrations.AlterField(
            model_name='audiobook',
            name='cover_art_jpg',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='audiobook',
            name='narrator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='narrations', to='Narratica.narrator'),
        ),
        migrations.AlterField(
            model_name='audiobook',
            name='publisher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='publications', to='Narratica.publisher'),
        ),
        migrations.AlterField(
            model_name='audiobook',
            name='total_time',
            field=models.CharField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='bookchapter',
            name='total_time',
            field=models.CharField(),
        ),
        migrations.AlterField(
            model_name='bookchapter',
            name='upload_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='playlist',
            name='created_at',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
