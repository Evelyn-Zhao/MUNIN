# Generated by Django 2.0.1 on 2018-10-26 00:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0026_auto_20181022_0440'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='experiment',
            name='experimenters',
        ),
    ]
