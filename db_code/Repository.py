from pymongo import MongoClient

import os, sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0] + 'backend')))
import Model

client = MongoClient('localhost')
db = client.seatswap

def get_user(email):
    users = db.users
    result = users.find_one({'email': email})
    return model.User(result)

def add_user(user):
    users = db.users
    users.insert_one(user.__dict__)