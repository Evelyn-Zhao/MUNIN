# Generated by Django 2.0.1 on 2018-10-16 03:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0020_outcome'),
    ]

    operations = [
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('partid', models.IntegerField(primary_key=True, serialize=False)),
                ('gender', models.CharField(max_length=12)),
                ('age', models.IntegerField()),
                ('occupation', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Participant_Experiment',
            fields=[
                ('exp_partid', models.IntegerField(primary_key=True, serialize=False)),
                ('video_recorded', models.BooleanField(default=False)),
                ('audio_recorded', models.BooleanField(default=False)),
                ('expid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='index.Experiment')),
                ('partid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='index.Participant')),
            ],
        ),
    ]
