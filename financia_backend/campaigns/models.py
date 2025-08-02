from django.db import models
from django.conf import settings

class PromotionalOffer(models.Model):
    CATEGORY_CHOICES = [
        ('LOAN', 'Loans'),
        ('INS',  'Insurance'),
        ('CC',   'Credit Cards'),
        ('GEN',  'General'),
    ]
    
    category        = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    title           = models.CharField(max_length=255)
    description     = models.TextField()
    promo_code      = models.CharField(max_length=50, blank=True, null=True)
    expiration      = models.DateField()
    target_criteria = models.JSONField(default=dict)  # Targeting parameters
    priority        = models.IntegerField(default=1)
    is_active       = models.BooleanField(default=True)
    image           = models.ImageField(upload_to='offer_images/', blank=True, null=True)

    # New: tag this offer by campaign key
    campaign        = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.title} ({self.campaign or 'general'})"


class EmailTemplate(models.Model):
    TEMPLATE_TYPES = [
        ('WELCOME',   'Welcome Email'),
        ('PROMO',     'Promotional Email'),
        ('FOLLOW_UP', 'Follow-up Email'),
        ('RE_ENGAGE', 'Re-engagement Email'),
    ]
    
    name          = models.CharField(max_length=100)
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPES)
    subject       = models.CharField(max_length=255)
    html_content  = models.TextField()              # Base template with placeholders
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    # New: optional campaign key (e.g. "spring_sale", "home_insurance")
    campaign      = models.CharField(max_length=100, blank=True, null=True)
    # New: array of example messages to ground your AI prompt
    examples      = models.JSONField(default=list, blank=True)
    # New: style hint for the AI (e.g. "friendly, concise")
    tone          = models.CharField(max_length=100, blank=True, null=True)
    # New: which placeholders / links must appear
    must_include  = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.name} ({self.get_template_type_display()})"
