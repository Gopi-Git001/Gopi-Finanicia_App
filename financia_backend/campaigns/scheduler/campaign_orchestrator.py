from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import pytz
from campaigns.tracking.conversion_handler import check_purchase

class CampaignOrchestrator:
    RULES = {
        "welcome": {
            "trigger": "signup",
            "delay": timedelta(minutes=30),
            "priority": 1
        },
        "cross_sell": {
            "trigger": "purchase",
            "delay": timedelta(days=1),
            "conditions": lambda u: u["tier"] != "premium",
            "priority": 2
        },
        "re_engagement": {
            "trigger": "inactivity",
            "delay": timedelta(days=21),
            "conditions": lambda u: not check_purchase(u["user_id"]),
            "priority": 3
        }
    }

    def __init__(self, db_path: str):
        self.scheduler = BackgroundScheduler(timezone=pytz.UTC)
        self.db = FinancialDB(db_path)
        self._setup_jobs()

    def _setup_jobs(self):
        self.scheduler.add_job(
            self._process_new_signups,
            'interval',
            minutes=5,
            id='signup_scan'
        )
        self.scheduler.add_job(
            self._process_purchase_events,
            'interval',
            hours=1,
            id='purchase_scan'
        )

    def start(self):
        self.scheduler.start()

    def _process_new_signups(self):
        with self.db._get_cursor() as cur:
            cur.execute("""
                SELECT user_id FROM users 
                WHERE signup_date > datetime('now', '-1 hour')
                AND welcome_sent = 0
            """)
            for row in cur.fetchall():
                self._trigger_campaign(row[0], "welcome")

    def _process_purchase_events(self):
        with self.db._get_cursor() as cur:
            cur.execute("""
                SELECT user_id FROM purchases 
                WHERE purchase_time > datetime('now', '-25 hours')
            """)
            for row in cur.fetchall():
                self._trigger_campaign(row[0], "cross_sell")

    def _trigger_campaign(self, user_id: str, campaign_type: str):
        rule = self.RULES[campaign_type]
        if "conditions" in rule:
            user = self._get_user_data(user_id)
            if not rule["conditions"](user):
                return
        
        run_time = datetime.utcnow() + rule["delay"]
        self.scheduler.add_job(
            self.execute_campaign,
            'date',
            run_date=run_time,
            args=[user_id, campaign_type],
            id=f"{campaign_type}_{user_id}",
            priority=rule["priority"]
        )