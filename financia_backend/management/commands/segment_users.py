import os
import csv
from django.core.management.base import BaseCommand
from django.utils import timezone
from users.models import UserActivity

SEGMENT_DIR = os.getenv('SEGMENT_DIR', '/tmp/segments')

class Command(BaseCommand):
    help = 'Segment users by activity into CSVs or enqueue campaigns.'

    def add_arguments(self, parser):
        parser.add_argument('--hours', type=int, default=24,
                            help='Look back this many hours for activity')
        parser.add_argument('--enqueue', action='store_true',
                            help='Enqueue Celery tasks instead of CSVs')

    def handle(self, *args, **options):
        since = timezone.now() - timezone.timedelta(hours=options['hours'])
        os.makedirs(SEGMENT_DIR, exist_ok=True)

        recs = (UserActivity.objects
                .filter(timestamp__gte=since)
                .values('activity', 'user_id')
                .distinct())

        segments = {}
        for r in recs:
            segments.setdefault(r['activity'], set()).add(r['user_id'])

        for activity, uids in segments.items():
            if options['enqueue']:
                from campaigns.tasks import dispatch_by_segment
                dispatch_by_segment.delay(activity.upper(), list(uids))
                self.stdout.write(self.style.SUCCESS(
                    f"Enqueued {len(uids)} users for '{activity}'"))
            else:
                path = os.path.join(SEGMENT_DIR, f"{activity.lower()}_users.csv")
                with open(path, 'w', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow(['user_id'])
                    for uid in sorted(uids):
                        writer.writerow([uid])
                self.stdout.write(self.style.SUCCESS(
                    f"Wrote {len(uids)} users to {path}"))