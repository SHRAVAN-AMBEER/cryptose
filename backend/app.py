from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import matplotlib.pyplot as plt
import io
import base64
import requests
from datetime import datetime
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/cryptoseDB"
mongo = PyMongo(app)
db = mongo.db

# ----------- REGISTRATION ROUTES -----------

@app.route('/register/user', methods=['POST'])
def register_user():
    data = request.get_json()
    db.users.insert_one({
        "username": data['username'],
        "email": data['email'],
        "password": data['password'],
        "role": "User"
    })
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/register/member', methods=['POST'])
def register_member():
    data = request.get_json()
    db.members.insert_one({
        "username": data['username'],
        "email": data['email'],
        "password": data['password'],
        "role": "Member"
    })
    return jsonify({"message": "Member registered successfully"}), 201

@app.route('/register/admin', methods=['POST'])
def register_admin():
    data = request.get_json()
    db.admins.insert_one({
        "username": data['username'],
        "email": data['email'],
        "password": data['password'],
        "role": "Admin"
    })
    return jsonify({"message": "Admin registered successfully"}), 201

@app.route('/admins', methods=['GET'])
def get_admins():
    admins = list(mongo.db.admins.find({}, {'_id': 0, 'username': 1, 'email': 1, 'role': 1}))
    return jsonify(admins)

# GET all users
@app.route("/get/users", methods=["GET"])
def get_users():
    users = list(mongo.db.users.find({}, {"password": 0}))  # hide password
    return jsonify(users)

# GET all members
@app.route("/get/members", methods=["GET"])
def get_members():
    members = list(mongo.db.members.find({}, {"password": 0}))
    return jsonify(members)

# Promote a user to member
@app.route("/promote/user", methods=["POST"])
def promote_user():
    user_id = request.json["id"]
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        db.members.insert_one(user)
        db.users.delete_one({"_id": ObjectId(user_id)})
        return jsonify({"message": "User promoted to Member"}), 200
    return jsonify({"error": "User not found"}), 404

# Demote a member to user
@app.route("/demote/member", methods=["POST"])
def demote_member():
    member_id = request.json["id"]
    member = db.members.find_one({"_id": ObjectId(member_id)})
    if member:
        db.users.insert_one(member)
        db.members.delete_one({"_id": ObjectId(member_id)})
        return jsonify({"message": "Member demoted to User"}), 200
    return jsonify({"error": "Member not found"}), 404

# Delete user or member
@app.route("/delete/<role>/<id>", methods=["DELETE"])
def delete_user_or_member(role, id):
    collection = db.users if role.lower() == "user" else db.members
    result = collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": f"{role.capitalize()} deleted successfully"}), 200
    return jsonify({"error": f"{role.capitalize()} not found"}), 404


# ----------- HOMEPAGE -----------

@app.route('/')
def home():
    return "🚀 CRYPTOSE Backend is running!"

# ----------- COIN HISTORY -----------

@app.route('/api/coin-history/<coin_id>')
def coin_history(coin_id):
    url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
    params = {"vs_currency": "usd", "days": 7, "interval": "daily"}
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data"}), 500

    data = response.json()
    prices = data["prices"]
    times = [datetime.fromtimestamp(p[0] / 1000).strftime('%b %d') for p in prices]
    values = [p[1] for p in prices]

    # Plot
    plt.figure(figsize=(10, 5))
    plt.plot(times, values, marker="o", linestyle='-', color='blue')
    plt.title(f"{coin_id.capitalize()} Price Trend (Last 7 Days)")
    plt.xlabel("Date")
    plt.ylabel("Price (USD)")
    plt.xticks(rotation=45)
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()
    encoded = base64.b64encode(img.getvalue()).decode('utf-8')

    return jsonify({
        "image": encoded,
        "history": [{"date": d, "price": p} for d, p in zip(times, values)]
    })

# ----------- CRYPTO DATA ROUTES -----------

@app.route('/api/market-data')
def market_data():
    url = 'https://api.coingecko.com/api/v3/coins/markets'
    params = {'vs_currency': 'usd', 'order': 'market_cap_desc', 'per_page': 10, 'page': 1}
    response = requests.get(url, params=params)
    return jsonify(response.json()) if response.status_code == 200 else jsonify({'error': 'Failed'}), 500

@app.route('/trending', methods=['GET'])
def get_trending():
    url = 'https://api.coingecko.com/api/v3/coins/markets'
    params = {'vs_currency': 'usd', 'order': 'market_cap_desc', 'per_page': 10, 'page': 1}
    response = requests.get(url, params=params)
    return jsonify(response.json()) if response.status_code == 200 else jsonify({'error': 'Failed'}), 500

@app.route('/api/member-market-data')
def member_market_data():
    url = 'https://api.coingecko.com/api/v3/coins/markets'
    params = {'vs_currency': 'usd', 'order': 'market_cap_desc', 'per_page': 50, 'page': 1}
    response = requests.get(url, params=params)
    return jsonify(response.json()) if response.status_code == 200 else jsonify({'error': 'Failed'}), 500

@app.route('/api/crypto')
def get_crypto_data():
    coins = [
        'bitcoin', 'ethereum', 'binancecoin', 'ripple', 'solana',
        'cardano', 'dogecoin', 'polkadot', 'avalanche-2', 'chainlink'
    ]
    url = 'https://api.coingecko.com/api/v3/coins/markets'
    params = {'vs_currency': 'usd', 'ids': ','.join(coins), 'order': 'market_cap_desc'}
    response = requests.get(url, params=params)
    return jsonify(response.json()) if response.status_code == 200 else jsonify({'error': 'Failed'}), 500

@app.route("/api/compare")
def compare_graph():
    coins = request.args.get("coins", "")
    coin_list = coins.split(",")
    if not coin_list or len(coin_list) < 2:
        return jsonify({"error": "At least two coins required"}), 400

    all_data = {}
    for coin in coin_list:
        url = f"https://api.coingecko.com/api/v3/coins/{coin}/market_chart"
        params = {"vs_currency": "usd", "days": 7, "interval": "daily"}
        res = requests.get(url, params=params)
        if res.status_code != 200:
            continue
        data = res.json()["prices"]
        dates = [datetime.fromtimestamp(p[0] / 1000).strftime("%b %d") for p in data]
        values = [p[1] for p in data]
        all_data[coin.capitalize()] = (dates, values)

    plt.figure(figsize=(12, 6))
    for coin_name, (dates, values) in all_data.items():
        plt.plot(dates, values, marker="o", label=coin_name)

    plt.title("Crypto Comparison (Last 7 Days)")
    plt.xlabel("Date")
    plt.ylabel("Price (USD)")
    plt.xticks(rotation=45)
    plt.legend()
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    plt.close()

    encoded_img = base64.b64encode(buf.read()).decode("utf-8")
    return jsonify({"image": encoded_img})



# ----------- MAIN -----------

if __name__ == '__main__':
    app.run(debug=True)
