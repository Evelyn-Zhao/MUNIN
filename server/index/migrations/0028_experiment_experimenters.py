# Generated by Django 2.0.1 on 2018-10-26 00:26

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0027_remove_experiment_experimenters'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='experimenters',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), default=[], size=None),
            preserve_default=False,
        ),
    ]
