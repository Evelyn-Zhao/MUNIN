# Generated by Django 2.0.1 on 2018-05-21 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Users',
            fields=[
                ('usrid', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('usrname', models.CharField(max_length=20)),
                ('usrpwd', models.CharField(max_length=40)),
                ('usremail', models.CharField(max_length=30)),
                ('usrauthority', models.IntegerField()),
            ],
        ),
    ]
