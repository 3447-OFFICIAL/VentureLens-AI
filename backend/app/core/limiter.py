from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import FastAPI
import os

# Initialize limiter backed by memory for dev, redis for prod
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# In a true enterprise setup, we'd use moving-window with Redis.
# For simplicity, we fallback to memory if REDIS_URL is purely local without redis running
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

def setup_rate_limiting(app: FastAPI):
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
