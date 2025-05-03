import time
from functools import wraps
from collections import deque
import logging
import random
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class Cache:
    def __init__(self, ttl_seconds=60):
        self.cache = {}
        self.ttl = ttl_seconds

    def get(self, key):
        if key in self.cache:
            value, timestamp = self.cache[key]
            if datetime.now() - timestamp < timedelta(seconds=self.ttl):
                return value
            else:
                del self.cache[key]
        return None

    def set(self, key, value):
        self.cache[key] = (value, datetime.now())

class RateLimiter:
    def __init__(self, max_requests, time_window, max_backoff=32):
        self.max_requests = max_requests
        self.time_window = time_window  # in seconds
        self.requests = deque(maxlen=max_requests)
        self.backoff_time = 1  # Start with 1 second
        self.max_backoff = max_backoff
        self.last_429 = None
        self.cache = Cache()
        
    def _apply_jitter(self, delay):
        """Add random jitter to prevent thundering herd problem"""
        return delay * (0.5 + random.random())
        
    def _exponential_backoff(self):
        """Calculate exponential backoff time with jitter"""
        if self.last_429 and time.time() - self.last_429 < self.backoff_time:
            # Double the backoff time up to max_backoff
            self.backoff_time = min(self.backoff_time * 2, self.max_backoff)
        else:
            # Reset backoff if enough time has passed
            self.backoff_time = 1
            
        return self._apply_jitter(self.backoff_time)
        
    def can_make_request(self):
        now = time.time()
        
        # Remove old requests
        while self.requests and self.requests[0] < now - self.time_window:
            self.requests.popleft()
            
        # Check if we can make a new request
        if len(self.requests) < self.max_requests:
            self.requests.append(now)
            return True
        return False

    def wait_for_token(self):
        attempts = 0
        while not self.can_make_request():
            delay = self._exponential_backoff()
            logger.warning(f"Rate limit reached. Backing off for {delay:.2f} seconds (attempt {attempts + 1})")
            time.sleep(delay)
            attempts += 1
        return True

    def record_429(self):
        """Record when we receive a 429 response"""
        self.last_429 = time.time()
        
    def get_cached(self, cache_key):
        """Get cached response if available"""
        return self.cache.get(cache_key)
        
    def cache_response(self, cache_key, response):
        """Cache a successful response"""
        self.cache.set(cache_key, response)

# Create a rate limiter instance for CoinGecko
# Free tier allows 10-30 calls per minute
coingecko_limiter = RateLimiter(max_requests=10, time_window=60)

def rate_limit(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Generate cache key from function name and arguments
        cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
        
        # Check cache first
        cached_response = coingecko_limiter.get_cached(cache_key)
        if cached_response is not None:
            logger.info(f"Returning cached response for {func.__name__}")
            return cached_response
            
        # Wait for available token
        coingecko_limiter.wait_for_token()
        
        # Make the actual request
        response = func(*args, **kwargs)
        
        # If it's a tuple with an error message about rate limiting
        if isinstance(response, tuple) and len(response) == 2 and isinstance(response[1], str) and "Rate limit" in response[1]:
            coingecko_limiter.record_429()
            return response
            
        # Cache successful response
        coingecko_limiter.cache_response(cache_key, response)
        return response
        
    return wrapper