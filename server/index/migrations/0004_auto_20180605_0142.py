# Generated by Django 2.0.1 on 2018-06-05 01:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0003_auto_20180604_0338'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='users',
            name='usrid',
        ),
        migrations.AlterField(
            model_name='users',
            name='usrname',
            field=models.CharField(max_length=20, primary_key=True, serialize=False),
        ),
    ]
