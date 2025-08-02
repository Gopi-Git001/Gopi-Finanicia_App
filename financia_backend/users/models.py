from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

class CustomUser(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    last_email_opened = models.DateTimeField(null=True, blank=True)
    email_open_count = models.IntegerField(default=0)
    is_active_user = models.BooleanField(default=False)
    # REMOVED preferences JSONField

# users/models.py
class UserPreferences(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='preferences')
    promotional = models.BooleanField(default=True)
    finance = models.BooleanField(default=False)
    technology = models.BooleanField(default=False)
    shopping = models.BooleanField(default=False)
    travel = models.BooleanField(default=False)
    # Add other preference categories as needed


# models.py
class EmailInteraction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    email_type = models.CharField(max_length=50)  # 'WELCOME', 'PROMOTIONAL', 'FOLLOW_UP', etc.
    sent_at = models.DateTimeField(auto_now_add=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    follow_up_sent = models.BooleanField(default=False)
    follow_up_count = models.PositiveIntegerField(default=0)
    original_interaction = models.ForeignKey(
        'self', 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL, 
        related_name='follow_ups'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} ➔ {self.email_type} @ {self.sent_at}"
    
    class Meta:
        indexes = [
            models.Index(fields=['user', 'sent_at']),
            models.Index(fields=['follow_up_sent']),
            models.Index(fields=['opened_at']),  # Added for performance
            models.Index(fields=['email_type']),  # Added for performance
        ]
        ordering = ['-sent_at']

# Signal to create preferences
@receiver(post_save, sender=CustomUser)
def create_user_preferences(sender, instance, created, **kwargs):
    if created:
        UserPreferences.objects.create(user=instance)