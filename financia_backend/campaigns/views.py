# campaigns/views.py

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from users.models import CustomUser, EmailInteraction
from django.shortcuts import get_object_or_404

@csrf_exempt
def track_email_open(request, user_id):
    """Track email opens with a transparent pixel"""
    try:
        user = CustomUser.objects.get(id=user_id)
        user.last_email_opened = timezone.now()
        user.email_open_count += 1
        
        # Mark user as active if they open emails consistently
        if user.email_open_count > 2:
            user.is_active_user = True
        user.save()
        
        # Update interaction record
        interaction = EmailInteraction.objects.filter(
            user=user,
            opened_at__isnull=True
        ).order_by('-sent_at').first()
        
        if interaction:
            interaction.opened_at = timezone.now()
            interaction.opened_count += 1
            interaction.save()
        
        # Return transparent pixel
        pixel = b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
        return HttpResponse(pixel, content_type='image/gif')
    
    except CustomUser.DoesNotExist:
        return HttpResponse(status=404)

@csrf_exempt
def handle_unsubscribe(request, user_id):
    """Handle unsubscribe requests"""
    user = get_object_or_404(CustomUser, id=user_id)
    
    if request.method == 'POST':
        # Update user preferences
        if not user.preferences:
            user.preferences = {}
        user.preferences['promotional'] = False
        user.save()
        
        return HttpResponse("You have been unsubscribed from promotional emails.")
    
    return HttpResponse("""
        <form method="post">
            <p>Are you sure you want to unsubscribe?</p>
            <button type="submit">Unsubscribe</button>
        </form>
    """)