# users/migrations/0002_add_default_preferences.py
from django.db import migrations

def create_default_preferences(apps, schema_editor):
    UserPreferences = apps.get_model('users', 'UserPreferences')
    CustomUser = apps.get_model('users', 'CustomUser')
    
    for user in CustomUser.objects.all():
        UserPreferences.objects.get_or_create(user=user)

class Migration(migrations.Migration):
    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_preferences),
    ]