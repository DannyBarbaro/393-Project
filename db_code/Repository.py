from pymongo import MongoClient

import os, sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0] + 'backend')))
import Model

client = MongoClient('localhost')
db = client.seatswap

def get_user(email):
    users = db.users
    result = users.find_one({'email': email})
    return Model.User(result) if result else None

def add_user(user):
    users = db.users
    users.insert_one(user.__dict__)

def update_user(new_user):
    users = db.users
    users.update_one({'email': new_user.email}, {'$set' : new_user.__dict__})