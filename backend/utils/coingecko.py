import requests
import logging
from backend.utils.rate_limiter import rate_limit
from functools import wraps
import time
import json

logger = logging.getLogger(__name__)

class CoinGeckoAPI:
    BASE_URL = 'https://api.coingecko.com/api/v3'
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Accept': 'application/json',
            'User-Agent': 'cryptose/1.0'
        })
    
    @rate_limit
    def _make_request(self, endpoint, params=None):
        url = f"{self.BASE_URL}/{endpoint}"
        try:
            response = self.session.get(url, params=params, timeout=10)
            
            if response.status_code == 429:
                logger.warning("Rate limit hit, backing off and retrying later")
                return None, "Rate limit exceeded. Please try again in a minute."
                
            if response.status_code != 200:
                logger.error(f"CoinGecko API error: {response.status_code} - {response.text}")
                return None, f"API error: {response.status_code}"
            
            try:
                return response.json(), None
            except json.JSONDecodeError:
                logger.error(f"Failed to decode JSON response: {response.text}")
                return None, "Invalid JSON response"
                
        except requests.Timeout:
            logger.error("Request to CoinGecko timed out")
            return None, "Request timed out"
        except requests.ConnectionError:
            logger.error("Connection to CoinGecko failed")
            return None, "Connection failed"
        except requests.RequestException as e:
            logger.error(f"Request to CoinGecko failed: {str(e)}")
            return None, str(e)
    
    def get_coin_market_data(self, coin_id):
        """Get market data for a specific coin"""
        return self._make_request(f"coins/{coin_id}")
    
    def get_market_chart(self, coin_id, vs_currency='usd', days=7, interval='daily'):
        """Get historical market data"""
        params = {
            'vs_currency': vs_currency,
            'days': days,
            'interval': interval
        }
        return self._make_request(f"coins/{coin_id}/market_chart", params)
    
    def get_markets(self, vs_currency='usd', per_page=50, page=1, order='market_cap_desc'):
        """Get market data for multiple coins"""
        params = {
            'vs_currency': vs_currency,
            'per_page': per_page,
            'page': page,
            'order': order,
            'sparkline': 'false'  # Reduce response size
        }
        return self._make_request("coins/markets", params)

# Create a singleton instance
coingecko = CoinGeckoAPI()