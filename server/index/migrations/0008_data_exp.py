# Generated by Django 2.0.1 on 2018-07-03 01:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0007_data_datatype'),
    ]

    operations = [
        migrations.AddField(
            model_name='data',
            name='exp',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='index.Experiment'),
            preserve_default=False,
        ),
    ]
