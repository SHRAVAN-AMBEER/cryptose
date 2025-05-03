from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import matplotlib.pyplot as plt
import io
import base64
import requests
from datetime import datetime
from bson import ObjectId
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from backend.routes.compare import compare_bp
import sys
import logging
from backend.utils.coingecko import coingecko  # Fix the import path

# Set up detailed logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# MongoDB Configuration with detailed error handling
try:
    app.config["MONGO_URI"] = "mongodb://localhost:27017/cryptoseDB"
    logger.info("Attempting to connect to MongoDB...")
    mongo = PyMongo(app)
    # Test the connection
    mongo.db.command('ping')
    logger.info("✅ Connected to MongoDB successfully!")
    logger.info(f"Available collections: {mongo.db.list_collection_names()}")
    db = mongo.db
except Exception as e:
    logger.error(f"❌ Failed to connect to MongoDB: {str(e)}")
    sys.exit(1)

# Test MongoDB connection
@app.route('/test-db')
def test_db():
    try:
        # Try to ping the database
        mongo.db.command('ping')
        # Try to list all collections
        collections = mongo.db.list_collection_names()
        return jsonify({
            "status": "success",
            "message": "MongoDB is connected",
            "collections": list(collections)
        })
    except Exception as e:
        logger.error(f"Database test failed: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"MongoDB connection failed: {str(e)}"
        }), 500

# ----------- AUTHENTICATION & PROFILE ROUTES -----------

@app.route('/check-auth', methods=['GET'])
def check_auth():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "No token provided"}), 401
    
    token = auth_header.split(' ')[1]
    # In a real app, verify the JWT token here
    # For now, we'll just check if it exists
    if token:
        return jsonify({"authenticated": True}), 200
    return jsonify({"authenticated": False}), 401

@app.route('/profile', methods=['GET'])
def get_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401

    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email required"}), 400

    # Check in all collections
    user = db.users.find_one({"email": email}, {"password": 0})
    if user:
        return jsonify(user)
    
    member = db.members.find_one({"email": email}, {"password": 0})
    if member:
        return jsonify(member)
    
    admin = db.admins.find_one({"email": email}, {"password": 0})
    if admin:
        return jsonify(admin)
    
    return jsonify({"error": "Profile not found"}), 404

@app.route('/profile', methods=['PUT'])
def update_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email required"}), 400

    update_data = {
        "username": data.get('username'),
        "profile": {
            "bio": data.get('bio'),
            "location": data.get('location'),
            "preferences": data.get('preferences', {})
        }
    }

    # Update in appropriate collection
    user = db.users.find_one_and_update(
        {"email": email},
        {"$set": update_data},
        return_document=True
    )
    if user:
        return jsonify(user)
    
    member = db.members.find_one_and_update(
        {"email": email},
        {"$set": update_data},
        return_document=True
    )
    if member:
        return jsonify(member)
    
    admin = db.admins.find_one_and_update(
        {"email": email},
        {"$set": update_data},
        return_document=True
    )
    if admin:
        return jsonify(admin)
    
    return jsonify({"error": "Profile not found"}), 404

# ----------- USER MANAGEMENT ROUTES -----------

# New route to check if email exists
@app.route('/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
        
    # Check in all collections
    user = db.users.find_one({"email": email})
    member = db.members.find_one({"email": email})
    admin = db.admins.find_one({"email": email})
    
    exists_in = None
    if admin:
        exists_in = "admin"
    elif member:
        exists_in = "member"
    elif user:
        exists_in = "user"

    return jsonify({
        "exists": bool(user or member or admin),
        "collection": exists_in
    }), 200

# New route for password reset request
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('newPassword')
    
    if not email or not new_password:
        return jsonify({"error": "Email and new password are required"}), 400
        
    # Try updating in each collection
    user = db.users.find_one_and_update(
        {"email": email},
        {"$set": {"password": new_password}}
    )
    if user:
        return jsonify({"message": "Password reset successful"}), 200
        
    member = db.members.find_one_and_update(
        {"email": email},
        {"$set": {"password": new_password}}
    )
    if member:
        return jsonify({"message": "Password reset successful"}), 200
        
    admin = db.admins.find_one_and_update(
        {"email": email},
        {"$set": {"password": new_password}}
    )
    if admin:
        return jsonify({"message": "Password reset successful"}), 200
        
    return jsonify({"error": "Email not found"}), 404

# ----------- REGISTRATION ROUTES -----------

@app.route('/register/user', methods=['POST'])
def register_user():
    data = request.get_json()
    logger.info(f"Received registration request with data: {data}")
    
    try:
        # Check if email already exists in any collection
        exists_in = None
        if db.users.find_one({"email": data['email']}):
            exists_in = "users"
        elif db.members.find_one({"email": data['email']}):
            exists_in = "members"
        elif db.admins.find_one({"email": data['email']}):
            exists_in = "admins"
            
        if exists_in:
            logger.warning(f"Email {data['email']} already exists in {exists_in} collection")
            return jsonify({"error": "Email already exists", "collection": exists_in}), 409

        # Create new user with coinHistory array
        new_user = {
            "username": data['username'],
            "email": data['email'],
            "password": data['password'],
            "role": "User",
            "profile": {
                "bio": "",
                "location": "",
                "preferences": {}
            },
            "coinHistory": []  # Initialize empty coin history array
        }
        logger.info(f"Attempting to insert new user: {new_user}")
        
        try:
            result = db.users.insert_one(new_user)
            logger.info(f"User insertion successful with id: {result.inserted_id}")
            
            # Verify the insert by reading back the document
            inserted_user = db.users.find_one({"_id": result.inserted_id})
            if inserted_user:
                logger.info(f"Successfully verified user insertion: {inserted_user}")
                return jsonify({"message": "User registered successfully", "success": True}), 201
            else:
                logger.error("User insertion verification failed - document not found")
                return jsonify({"error": "Failed to verify user creation", "success": False}), 500
                
        except Exception as insert_error:
            logger.error(f"MongoDB insert error: {str(insert_error)}")
            return jsonify({"error": "Database error during user creation", "success": False}), 500
            
    except Exception as e:
        logger.error(f"Error during user registration: {str(e)}")
        return jsonify({"error": str(e), "success": False}), 500

app.register_blueprint(compare_bp)

@app.route('/register/member', methods=['POST'])
def register_member():
    data = request.get_json()
    logger.info(f"Received member registration request with data: {data}")
    
    try:
        # Check if email already exists in any collection
        exists_in = None
        if db.users.find_one({"email": data['email']}):
            exists_in = "users"
        elif db.members.find_one({"email": data['email']}):
            exists_in = "members"
        elif db.admins.find_one({"email": data['email']}):
            exists_in = "admins"
            
        if exists_in:
            logger.warning(f"Email {data['email']} already exists in {exists_in} collection")
            return jsonify({"error": "Email already exists", "collection": exists_in}), 409

        # Create new member with coinHistory array
        new_member = {
            "username": data['username'],
            "email": data['email'],
            "password": data['password'],
            "role": "Member",
            "profile": {
                "bio": "",
                "location": "",
                "preferences": {}
            },
            "coinHistory": []  # Initialize empty coin history array
        }
        logger.info(f"Attempting to insert new member: {new_member}")
        
        try:
            result = db.members.insert_one(new_member)
            logger.info(f"Member insertion successful with id: {result.inserted_id}")
            
            # Verify the insert by reading back the document
            inserted_member = db.members.find_one({"_id": result.inserted_id})
            if inserted_member:
                logger.info(f"Successfully verified member insertion: {inserted_member}")
                return jsonify({"message": "Member registered successfully", "success": True}), 201
            else:
                logger.error("Member insertion verification failed - document not found")
                return jsonify({"error": "Failed to verify member creation", "success": False}), 500
                
        except Exception as insert_error:
            logger.error(f"MongoDB insert error: {str(insert_error)}")
            return jsonify({"error": "Database error during member creation", "success": False}), 500
            
    except Exception as e:
        logger.error(f"Error during member registration: {str(e)}")
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/register/admin', methods=['POST'])
def register_admin():
    data = request.get_json()
    logger.info(f"Received admin registration request with data: {data}")
    
    try:
        # Check if email already exists in any collection
        exists_in = None
        if db.users.find_one({"email": data['email']}):
            exists_in = "users"
        elif db.members.find_one({"email": data['email']}):
            exists_in = "members"
        elif db.admins.find_one({"email": data['email']}):
            exists_in = "admins"
            
        if exists_in:
            logger.warning(f"Email {data['email']} already exists in {exists_in} collection")
            return jsonify({"error": "Email already exists", "collection": exists_in}), 409

        # Attempt to insert the new admin
        new_admin = {
            "username": data['username'],
            "email": data['email'],
            "password": data['password'],
            "role": "Admin",
            "profile": {
                "bio": "",
                "location": "",
                "preferences": {}
            }
        }
        logger.info(f"Attempting to insert new admin: {new_admin}")
        
        try:
            result = db.admins.insert_one(new_admin)
            logger.info(f"Admin insertion successful with id: {result.inserted_id}")
            
            # Verify the insert by reading back the document
            inserted_admin = db.admins.find_one({"_id": result.inserted_id})
            if inserted_admin:
                logger.info(f"Successfully verified admin insertion: {inserted_admin}")
                return jsonify({"message": "Admin registered successfully", "success": True}), 201
            else:
                logger.error("Admin insertion verification failed - document not found")
                return jsonify({"error": "Failed to verify admin creation", "success": False}), 500
                
        except Exception as insert_error:
            logger.error(f"MongoDB insert error: {str(insert_error)}")
            return jsonify({"error": "Database error during admin creation", "success": False}), 500
            
    except Exception as e:
        logger.error(f"Error during admin registration: {str(e)}")
        return jsonify({"error": str(e), "success": False}), 500

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
    data, error = coingecko.get_market_chart(coin_id)
    if error:
        return jsonify({"error": error}), 429 if "Rate limit" in error else 500

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

# ----------- COIN HISTORY TRACKING -----------

@app.route('/track-coin-view', methods=['POST'])
def track_coin_view():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        logger.error('Unauthorized attempt to track coin view - no token')
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.get_json()
        logger.info(f"Received coin view tracking request: {data}")
        
        email = data.get('email')
        coin_id = data.get('coinId')
        source = data.get('source', 'graph')  # 'graph', 'compare', or 'ai-assist'
        
        if not email or not coin_id:
            logger.error(f"Missing required fields: email={email}, coinId={coin_id}")
            return jsonify({"error": "Email and coinId required"}), 400

        # Create coin view record
        coin_view = {
            "coinId": coin_id,
            "timestamp": datetime.utcnow(),
            "price": float(data.get('price', 0)),
            "name": data.get('name', coin_id),
            "symbol": data.get('symbol', ''),
            "image": data.get('image', ''),
            "market_cap": float(data.get('market_cap', 0)),
            "market_cap_rank": int(data.get('market_cap_rank', 0)),
            "viewedAt": datetime.utcnow().isoformat(),
            "source": source,
            "viewType": "click"
        }

        # Check in both users and members collections
        user = db.users.find_one({"email": email})
        member = db.members.find_one({"email": email})

        if member:
            # Update member's coin history
            result = db.members.update_one(
                {"email": email},
                {
                    "$push": {
                        "coinHistory": {
                            "$each": [coin_view],
                            "$sort": {"timestamp": -1},
                            "$slice": 50  # Keep last 50 entries
                        }
                    }
                }
            )
            if result.modified_count > 0:
                logger.info(f"Successfully added coin to history for member {email}")
                return jsonify({
                    "message": "Coin view tracked successfully",
                    "status": "success"
                }), 200
        elif user:
            # Update user's coin history
            result = db.users.update_one(
                {"email": email},
                {
                    "$push": {
                        "coinHistory": {
                            "$each": [coin_view],
                            "$sort": {"timestamp": -1},
                            "$slice": 25  # Keep last 25 entries for users
                        }
                    }
                }
            )
            if result.modified_count > 0:
                logger.info(f"Successfully added coin to history for user {email}")
                return jsonify({
                    "message": "Coin view tracked successfully",
                    "status": "success"
                }), 200
                
        logger.error(f"User/Member not found with email: {email}")
        return jsonify({"error": "User/Member not found"}), 404

    except Exception as e:
        logger.error(f"Error tracking coin view: {str(e)}")
        return jsonify({"error": f"Server error tracking coin view: {str(e)}"}), 500

@app.route('/track-compare-coins', methods=['POST'])
def track_compare_coins():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data = request.get_json()
        email = data.get('email')
        coins = data.get('coins', [])  # List of coin IDs being compared
        
        if not email or not coins:
            return jsonify({"error": "Email and coins are required"}), 400

        # Create tracking records for each coin
        timestamp = datetime.utcnow()
        for coin in coins:
            coin_view = {
                "coinId": coin['id'],
                "timestamp": timestamp,
                "price": float(coin.get('price', 0)),
                "name": coin.get('name', coin['id']),
                "symbol": coin.get('symbol', ''),
                "image": coin.get('image', ''),
                "market_cap": float(coin.get('market_cap', 0)),
                "market_cap_rank": int(coin.get('market_cap_rank', 0)),
                "viewedAt": timestamp.isoformat(),
                "source": "compare",
                "viewType": "compare"
            }

            # Update member's coin history
            result = db.members.update_one(
                {"email": email},
                {
                    "$push": {
                        "coinHistory": {
                            "$each": [coin_view],
                            "$sort": {"timestamp": -1},
                            "$slice": 50
                        }
                    }
                }
            )
            
            if result.modified_count == 0:
                return jsonify({"error": "Member not found"}), 404

        return jsonify({
            "message": "Coin comparison tracked successfully",
            "status": "success"
        }), 200

    except Exception as e:
        logger.error(f"Error tracking coin comparison: {str(e)}")
        return jsonify({"error": f"Server error tracking coin comparison"}), 500

@app.route('/get-coin-history', methods=['GET'])
def get_coin_history():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"error": "Unauthorized"}), 401

    email = request.args.get('email')
    if not email:
        return jsonify({"error": "Email required"}), 400

    logger.info(f"Fetching coin history for email: {email}")

    # Check in all collections
    collections = {
        'users': db.users,
        'members': db.members,
        'admins': db.admins
    }

    for role, collection in collections.items():
        user_data = collection.find_one(
            {"email": email},
            {"coinHistory": 1, "_id": 0}
        )
        
        if user_data and "coinHistory" in user_data:
            history = user_data["coinHistory"]
            # Sort history by timestamp in descending order
            sorted_history = sorted(
                history,
                key=lambda x: x.get('timestamp', ''),
                reverse=True
            )
            
            logger.info(f"Found {len(sorted_history)} coin history records for {role}")
            return jsonify({
                "history": sorted_history,
                "role": role,
                "status": "success"
            })

    logger.info(f"No coin history found for email: {email}")
    return jsonify({
        "history": [],
        "status": "success",
        "message": "No history found"
    }), 200

# ----------- CRYPTO DATA ROUTES -----------

@app.route('/api/market-data')
def market_data():
    data, error = coingecko.get_markets(per_page=10)
    if error:
        return jsonify({"error": error}), 429 if "Rate limit" in error else 500
    return jsonify(data)

@app.route('/trending', methods=['GET'])
def get_trending():
    url = 'https://api.coingecko.com/api/v3/coins/markets'
    params = {'vs_currency': 'usd', 'order': 'market_cap_desc', 'per_page': 10, 'page': 1}
    response = requests.get(url, params=params)
    return jsonify(response.json()) if response.status_code == 200 else jsonify({'error': 'Failed'}), 500

import logging

@app.route('/api/member-market-data')
def member_market_data():
    data, error = coingecko.get_markets(per_page=50)
    if error:
        return jsonify({"error": error}), 429 if "Rate limit" in error else 500
    return jsonify(data)

@app.route('/api/crypto')
def get_crypto_data():
    coins = [
        'bitcoin', 'ethereum', 'binancecoin', 'ripple', 'solana',
        'cardano', 'dogecoin', 'polkadot', 'avalanche-2', 'chainlink'
    ]
    data, error = coingecko.get_markets(per_page=len(coins))
    if error:
        return jsonify({"error": error}), 429 if "Rate limit" in error else 500
    
    # Filter to get only the coins we want
    filtered_data = [coin for coin in data if coin['id'] in coins]
    return jsonify(filtered_data)

@app.route("/api/compare")
def compare_graph():
    coins = request.args.get("coins", "")
    coin_list = coins.split(",")
    if not coin_list or len(coin_list) < 2:
        return jsonify({"error": "At least two coins required"}), 400

    all_data = {}
    for coin in coin_list:
        data, error = coingecko.get_market_chart(coin)
        if error:
            continue
        
        prices = data["prices"]
        dates = [datetime.fromtimestamp(p[0] / 1000).strftime("%b %d") for p in prices]
        values = [p[1] for p in prices]
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


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Check in admin collection first
    admin = db.admins.find_one({"email": email, "password": password})
    if admin:
        return jsonify({
            "success": True,
            "user": {
                "username": admin.get('username'),
                "email": admin['email'],
                "role": "admin"
            }
        }), 200

    # Check in member collection
    member = db.members.find_one({"email": email, "password": password})
    if member:
        return jsonify({
            "success": True,
            "user": {
                "username": member.get('username'),
                "email": member['email'],
                "role": "member"
            }
        }), 200

    # Check in user collection
    user = db.users.find_one({"email": email, "password": password})
    if user:
        return jsonify({
            "success": True,
            "user": {
                "username": user.get('username'),
                "email": user['email'],
                "role": "user"
            }
        }), 200

    return jsonify({"success": False, "error": "Invalid credentials"}), 401

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    new_password = data.get('newPassword')
    
    if not email or not new_password:
        return jsonify({"error": "Email and new password are required"}), 400
        
    # Try updating in each collection
    collections = {
        'users': db.users,
        'members': db.members,
        'admins': db.admins
    }
    
    for collection_name, collection in collections.items():
        result = collection.find_one_and_update(
            {"email": email},
            {"$set": {"password": new_password}},
            return_document=True
        )
        if result:
            return jsonify({
                "success": True,
                "message": "Password reset successful",
                "collection": collection_name
            }), 200
            
    return jsonify({"success": False, "error": "Email not found"}), 404

# ----------- MAIN -----------

if __name__ == '__main__':
    app.run(debug=True)