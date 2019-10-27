from pymongo import MongoClient
client = MongoClient('localhost')
db = client.seatswap

def getUser(email):
    users = db.users
    result = users.find_one({'email': email})
    del result['_id']
    return result