# campaigns/__init__.py
import logging, os
from prometheus_client import start_http_server, Counter, Histogram

# Metrics
EMAIL_GENERATED = Counter('emails_generated', 'Total emails generated')
GEMINI_LATENCY = Histogram('gemini_latency', 'Gemini response latency')
DB_OPS = Counter('db_operations', 'Database operations', ['operation'])

# Logging config
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

def start_monitoring(port=9100):
    start_http_server(port)