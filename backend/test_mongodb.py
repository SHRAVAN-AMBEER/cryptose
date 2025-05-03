from pymongo import MongoClient
import sys

def test_mongodb_connection():
    try:
        # Try to connect to MongoDB
        client = MongoClient('mongodb://localhost:27017/')
        
        # Try to get server info
        server_info = client.server_info()
        
        # Get database
        db = client['cryptoseDB']
        
        # List all collections
        collections = db.list_collection_names()
        
        print("✅ MongoDB Connection Test Results:")
        print(f"MongoDB Version: {server_info['version']}")
        print(f"Available Collections: {collections}")
        
        # Try to create a test document
        result = db.test.insert_one({"test": "connection"})
        print("✅ Test document created successfully")
        
        # Clean up test document
        db.test.delete_one({"test": "connection"})
        print("✅ Test document cleaned up")
        
        return True
        
    except Exception as e:
        print("❌ MongoDB Connection Error:", str(e))
        return False
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    success = test_mongodb_connection()
    sys.exit(0 if success else 1)