# campaigns/tasks.py

import logging
from celery import shared_task
from django.utils import timezone
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.contrib.auth import get_user_model
from typing import TYPE_CHECKING
from campaigns.utils.email_generator import EmailGenerator
from users.models import EmailInteraction,CustomUser
from campaigns.models import PromotionalOffer
from django.db.models import F
from django.db import transaction

logger = logging.getLogger(__name__)
CustomUser = get_user_model()
if TYPE_CHECKING:
    from users.models import CustomUser

def _send_email(user: "CustomUser", email_data: dict):
    """Send email and create interaction record"""
    try:
        logger.info(f"Preparing email for {user.email}")
        
        msg = EmailMultiAlternatives(
            subject=email_data["subject"],
            body="Please view this message in an HTML-capable email client.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        msg.attach_alternative(email_data["html_message"], "text/html")
        msg.send()
        
        logger.info(f"Email sent to {user.email}")

        # Create interaction record
        interaction = EmailInteraction.objects.create(
            user=user,
            email_type=email_data.get("email_type", "PROMO"),
        )
        
        # Link offer if available
        if email_data.get("offer_id"):
            try:
                offer = PromotionalOffer.objects.get(id=email_data["offer_id"])
                interaction.offer = offer
                interaction.save()
            except PromotionalOffer.DoesNotExist:
                logger.warning(f"Offer not found: {email_data['offer_id']}")
                
    except Exception as e:
        logger.error(f"Failed to send email to {user.email}: {str(e)}")

# @shared_task
# def send_welcome_emails():
#     """Send welcome email to new users"""
#     logger.info("Starting welcome email task")
    
#     cutoff = timezone.now() - timezone.timedelta(days=1)
#     new_users = CustomUser.objects.filter(
#         date_joined__gte=cutoff,
#         emailinteraction__isnull=True  # No previous interactions
#     )
    
#     logger.info(f"Found {new_users.count()} new users to email")
    
#     for user in new_users:
#         try:
#             gen = EmailGenerator(user, email_type="WELCOME")
#             data = gen.generate_email()
#             _send_email(user, data)
#         except Exception as e:
#             logger.error(f"Error processing user {user.id}: {str(e)}")

# @shared_task
# def send_promotional_emails():
#     """Send promotional emails to active users"""
#     logger.info("Starting promotional email task")
    
#     cutoff_login = timezone.now() - timezone.timedelta(days=90)
#     cutoff_sent = timezone.now() - timezone.timedelta(minutes=1)

#     # Count users at each filtering stage
#     total_active = CustomUser.objects.filter(is_active=True).count()
    
#     # Query for users with promotional preference enabled
#     with_prefs = CustomUser.objects.filter(
#         is_active=True,
#         preferences__promotional=True  # JSONField query
#     ).count()
    
#     with_login = CustomUser.objects.filter(
#         is_active=True,
#         preferences__promotional=True,
#         last_login__gte=cutoff_login
#     ).count()
    
#     logger.info(f"Total active: {total_active}, With prefs: {with_prefs}, With login: {with_login}")

#     targets = CustomUser.objects.filter(
#         is_active=True,
#         preferences__promotional=True,  # JSONField query
#         #last_login__gte=cutoff_login
#     ).exclude(
#         emailinteraction__sent_at__gte=cutoff_sent,
#         emailinteraction__email_type="PROMO"
#     )
    
#     logger.info(f"Found {targets.count()} users for promotional emails")
    
#     # Log first 5 users for inspection
#     for user in targets[:5]:
#         logger.info(f"Target user: {user.email}, Last login: {user.last_login}")
#         # Access JSON preferences directly
#         logger.info(f"Preferences: promotional={user.preferences.promotional}")
    
#     for user in targets:
#         try:
#             gen = EmailGenerator(user, email_type="PROMO")
#             data = gen.generate_email()
#             _send_email(user, data)
#         except Exception as e:
#             logger.error(f"Error processing user {user.id}: {str(e)}")


# campaigns/tasks.py
# campaigns/tasks.py
# @shared_task
# def send_promotional_emails():
#     logger.info("Starting AI-powered promotional email task")
    
#     # Get users with promotional preferences enabled
#     users = CustomUser.objects.filter(
#         is_active=True,
#         preferences__promotional=True
#     )
    
#     logger.info(f"Found {users.count()} users for promotional emails")
    
#     for user in users:
#         try:
#             gen = EmailGenerator(user, email_type="PROMO")
#             email_data = gen.generate_email()
            
#             # Send email
#             msg = EmailMultiAlternatives(
#                 subject=email_data["subject"],
#                 body="Please view this message in an HTML-capable email client.",
#                 from_email=settings.DEFAULT_FROM_EMAIL,
#                 to=[user.email],
#             )
#             msg.attach_alternative(email_data["html_message"], "text/html")
#             msg.send()
            
#             # Create interaction record
#             interaction = EmailInteraction.objects.create(
#                 user=user,
#                 email_type="PROMO",
#             )
            
#             if email_data.get("offer_id"):
#                 try:
#                     offer = PromotionalOffer.objects.get(id=email_data["offer_id"])
#                     interaction.offer = offer
#                     interaction.save()
#                 except PromotionalOffer.DoesNotExist:
#                     logger.warning(f"Offer not found: {email_data['offer_id']}")
                    
#             logger.info(f"AI promotional email sent to {user.email}")
            
#         except Exception as e:
#             logger.error(f"Error sending to {user.email}: {str(e)}")
#-----------------------------------
#Working ------------------
# campaigns/tasks.py

from django.utils import timezone
from django.db.models import Exists, OuterRef

@shared_task
def send_promotional_emails():
    """Send promotional emails to active users who haven't received one today"""
    logger.info("Starting promotional email task")
    
    today = timezone.now().date()
    
    # Subquery to check for existing promotional emails today
    already_received_today = EmailInteraction.objects.filter(
        user=OuterRef('pk'),
        email_type="PROMO",
        sent_at__date=today
    )
    
    # Get users with promotional preference enabled who haven't received today
    users = CustomUser.objects.filter(
        is_active=True,
        preferences__promotional=True
    ).annotate(
        already_received=Exists(already_received_today)
    ).filter(
        already_received=False
    )
    
    # Get all promotional users for tracking
    all_promotional_users = CustomUser.objects.filter(
        is_active=True,
        preferences__promotional=True
    )
    
    # Detailed tracking information
    logger.info(f"Total promotional users: {all_promotional_users.count()}")
    logger.info(f"Already received today: {all_promotional_users.count() - users.count()}")
    logger.info(f"Eligible to receive: {users.count()}")
    
    # Log user emails for tracking
    if users.exists():
        logger.info("Eligible users:")
        for user in users:
            logger.info(f"  - {user.email}")
    
    sent_count = 0
    error_count = 0
    
    for user in users:
        try:
            gen = EmailGenerator(user, email_type="PROMO")
            email_data = gen.generate_email()
            
            # Send email with proper HTML content
            msg = EmailMultiAlternatives(
                subject=email_data["subject"],
                body="Please view this message in an HTML-capable email client.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )
            msg.attach_alternative(email_data["html_message"], "text/html")
            msg.send()
            
            logger.info(f"Promotional email sent to {user.email}")
            sent_count += 1
            
            # Create interaction record
            interaction = EmailInteraction.objects.create(
                user=user,
                email_type="PROMO",
            )
            
            # Link offer if available
            if email_data.get("offer_id"):
                try:
                    offer = PromotionalOffer.objects.get(id=email_data["offer_id"])
                    interaction.offer = offer
                    interaction.save()
                except PromotionalOffer.DoesNotExist:
                    logger.warning(f"Offer not found: {email_data['offer_id']}")
                    
        except Exception as e:
            logger.error(f"Error sending to {user.email}: {str(e)}", exc_info=True)
            error_count += 1
    
    # Final summary
    logger.info(
        f"Finished promotional email task. "
        f"Total: {all_promotional_users.count()}, "
        f"Sent: {sent_count}, "
        f"Skipped: {all_promotional_users.count() - users.count()}, "
        f"Errors: {error_count}"
    )
    
    # Return detailed tracking information
    return {
        "total_promotional_users": all_promotional_users.count(),
        "already_received_today": all_promotional_users.count() - users.count(),
        "attempted_send": users.count(),
        "successful_send": sent_count,
        "errors": error_count
    }


@shared_task
def send_welcome_emails():
    """Send welcome email to new users"""
    logger.info("Starting welcome email task")
    
    cutoff = timezone.now() - timezone.timedelta(days=1)
    new_users = CustomUser.objects.filter(
        date_joined__gte=cutoff,
        emailinteraction__isnull=True  # No previous interactions
    )
    
    logger.info(f"Found {new_users.count()} new users to email")
    
    for user in new_users:
        try:
            gen = EmailGenerator(user, email_type="WELCOME")
            email_data = gen.generate_email()
            
            # Send welcome email
            msg = EmailMultiAlternatives(
                subject="Welcome to Financia!",
                body="Please view this message in an HTML-capable email client.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
            )
            msg.attach_alternative(email_data["html_message"], "text/html")
            msg.send()
            
            logger.info(f"Welcome email sent to {user.email}")
            
            # Create interaction record
            EmailInteraction.objects.create(
                user=user,
                email_type="WELCOME",
            )
            
        except Exception as e:
            logger.error(f"Error sending welcome email to {user.email}: {str(e)}")


from django.contrib.auth import get_user_model

User = get_user_model()

@shared_task
def follow_up_unopened_emails():
    logger.warning("📬 Starting follow-up email task")
    
    today = timezone.now().date()
    three_days_ago = timezone.now() - timezone.timedelta(days=3)

    # Detailed timeframe logging
    logger.warning(f"DEBUG: Three days ago = {three_days_ago}")
    
    # 1. Get distinct users needing follow-ups
    base_qs = EmailInteraction.objects.filter(
        sent_at__lte=three_days_ago,
        opened_at__isnull=True,
        follow_up_sent=False,
        follow_up_count__lt=1,
        email_type__in=["WELCOME", "PROMOTIONAL"]
    )
    
    # Log detailed counts
    logger.warning(f"DEBUG: Found {base_qs.count()} interactions needing follow-up")
    
    user_ids = set(
        base_qs.values_list('user_id', flat=True).distinct()
    )
    logger.warning(f"DEBUG: Found {len(user_ids)} distinct users needing follow-up")

    # 2. Users already followed up TODAY
    already_followed_today = set(
        EmailInteraction.objects.filter(
            email_type="FOLLOW_UP",
            sent_at__date=today
        ).values_list('user_id', flat=True)
    )
    logger.warning(f"DEBUG: {len(already_followed_today)} users already followed up today")
    
    # Log user emails for tracking
    if already_followed_today:
        logger.info("Users already followed up today:")
        for user_id in already_followed_today:
            try:
                user = User.objects.get(id=user_id)
                logger.info(f"  - {user.email}")
            except User.DoesNotExist:
                logger.warning(f"  - User ID {user_id} not found")

    users_to_process = user_ids - already_followed_today
    total_sent = 0
    skipped = len(user_ids) - len(users_to_process)

    # 3. Process users not followed today
    for user_id in users_to_process:
        try:
            user = User.objects.get(id=user_id)
            logger.warning(f"🔄 Processing follow-up for {user.email}")
            
            with transaction.atomic():
                # Generate and send email
                gen = EmailGenerator(user, email_type="FOLLOW_UP")
                data = gen.generate_email()
                data["subject"] = f"Reminder: {data['subject']}"

                msg = EmailMultiAlternatives(
                    subject=data["subject"],
                    body="Please view this message in an HTML-capable email client.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user.email],
                )
                msg.attach_alternative(data["html_message"], "text/html")
                msg.send()

                # Update all qualifying interactions
                interactions = EmailInteraction.objects.filter(
                    user=user,
                    sent_at__lte=three_days_ago,
                    opened_at__isnull=True,
                    follow_up_sent=False,
                    follow_up_count__lt=1
                )
                logger.warning(f"DEBUG: Updating {interactions.count()} interactions for {user.email}")
                
                interactions.update(
                    follow_up_sent=True,
                    follow_up_count=F('follow_up_count') + 1
                )

                # Create follow-up record
                follow_up = EmailInteraction.objects.create(
                    user=user,
                    email_type="FOLLOW_UP",
                    sent_at=timezone.now(),
                )

                # Link to first qualifying interaction
                first_interaction = interactions.order_by('sent_at').first()
                if first_interaction:
                    follow_up.original_interaction = first_interaction
                    follow_up.save()

            logger.info(f"✅ Follow-up email sent to {user.email}")
            total_sent += 1

        except Exception as e:
            logger.error(f"❌ Error sending to user ID {user_id}: {str(e)}", exc_info=True)

    # Detailed summary
    logger.warning(
        f"🏁 Follow-up task done. "
        f"Total candidates: {len(user_ids)}, "
        f"Sent: {total_sent}, "
        f"Skipped: {skipped}, "
        f"Errors: {len(users_to_process) - total_sent}"
    )
    
    # Return detailed tracking information
    return {
        "total_candidates": len(user_ids),
        "already_followed_today": len(already_followed_today),
        "attempted_send": len(users_to_process),
        "successful_send": total_sent,
        "skipped": skipped,
        "errors": len(users_to_process) - total_sent
    }


            