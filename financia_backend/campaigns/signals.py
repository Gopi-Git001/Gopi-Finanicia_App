# users/signals.py (or in models.py)
from django.db.models.signals import post_save
from django.dispatch import receiver
from campaigns.tasks import send_welcome_emails, send_single_promotional_email
from users.models import CustomUser

@receiver(post_save, sender=CustomUser)
def handle_new_user(sender, instance, created, **kwargs):
    if created:
        # Schedule welcome email
        send_welcome_emails.apply_async(countdown=3600)  # 30 sec delay
        
        # Schedule promotional email after 1 minute
        send_single_promotional_email.apply_async(countdown=3600)

@receiver(post_save, sender=CustomUser)
def create_user_preferences(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'preferences'):
        UserPreferences.objects.create(user=instance)