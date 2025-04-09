from flask import Flask, render_template, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)

from routes.crypto import crypto_bp
app.register_blueprint(crypto_bp)

CORS(app)  # Allow cross-origin requests

@app.route('/')
def home():
    return "CRYPTOSE Backend is running."

@app.route('/api/market-data')
def market_data():
    url = 'https://api.coingecko.com/api/v3/coins/markets'
    params = {
        'vs_currency': 'usd',
        'order': 'market_cap_desc',
        'per_page': 10,
        'page': 1,
        'sparkline': False
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch data'}), 500


@app.route('/trending', methods=['GET'])
def get_trending():
    url = 'https://api.coingecko.com/api/v3/coins/markets'
    params = {
        'vs_currency': 'usd',
        'order': 'market_cap_desc',
        'per_page': 10,
        'page': 1,
        'sparkline': False
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch trending data'}), 500

@app.route('/api/member-market-data')
def member_market_data():
    url = 'https://api.coingecko.com/api/v3/coins/markets'
    params = {
        'vs_currency': 'usd',
        'order': 'market_cap_desc',
        'per_page': 50,
        'page': 1,
        'sparkline': False
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch member market data'}), 500


@app.route('/api/crypto')
def get_crypto_data():
    coins = [
        'bitcoin', 'ethereum', 'binancecoin', 'ripple', 'solana',
        'cardano', 'dogecoin', 'polkadot', 'avalanche-2', 'chainlink',
        'litecoin', 'uniswap', 'near', 'internet-computer'
    ]
    url = 'https://api.coingecko.com/api/v3/coins/markets'
    params = {
        'vs_currency': 'usd',
        'ids': ','.join(coins),
        'order': 'market_cap_desc',
        'per_page': len(coins),
        'page': 1,
        'sparkline': False
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch crypto data'}), 500

if __name__ == '__main__':
    app.run(debug=True)
