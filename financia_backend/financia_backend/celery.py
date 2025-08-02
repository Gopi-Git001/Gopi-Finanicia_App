# financia_backend/celery.py

import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'financia_backend.settings')

app = Celery('financia_backend')
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps
app.autodiscover_tasks()

# Scheduled tasks
app.conf.beat_schedule = {
    'send-promotional-emails': {
        'task': 'campaigns.tasks.send_promotional_emails',
        'schedule': 2*60,  # Every hour
    },
    'follow-up-unopened': {
        'task': 'campaigns.tasks.follow_up_unopened_emails',
        'schedule': 60*60.0,  # Daily
    },
    'send-welcome-emails': {
        'task': 'campaigns.tasks.send_welcome_emails',
        'schedule': 30.0,  # Every 5 minutes
    },
}