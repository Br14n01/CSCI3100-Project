# Generated by Django 5.1.7 on 2025-03-29 11:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('travel', '0002_alter_travel_end_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itinerary',
            name='date',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='travel',
            name='start_date',
            field=models.DateField(null=True),
        ),
    ]
