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
    
def get_group_by_id(id):
    groups = db.groups
    result = groups.find_one({'id': id})
    return Model.Group(result)

def get_group_by_owner(owner, event):
    groups = db.groups
    result = groups.find_one({'owner': owner, 'event': event})
    return Model.Group(result)

def add_group(group):
    groups = db.groups
    groups.insert_one(group.__dict__)

def add_user_to_group(user, group):
    groups = db.groups
    new_members = group.members
    new_members.append(user)
    groups.update_one({'id': group['id']}, {'$set': {'members': new_members}})
