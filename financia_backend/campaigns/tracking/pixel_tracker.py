from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from campaigns.compliance.content_validator import FinancialContentValidator

@csrf_exempt
def track_open(request):
    user_id = request.GET.get('user_id')
    campaign_id = request.GET.get('campaign_id')
    # Write to engagements via FinancialDB or ORM
    pixel = (
        b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80'
        b'\x00\x00\x00\x00\x00\x00\x00\x00\x21\xf9\x04'
        b'\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01'
        b'\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
    )
    return HttpResponse(pixel, content_type='image/gif')