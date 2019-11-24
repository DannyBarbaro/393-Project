from pymongo import MongoClient
from bson.objectid import ObjectId

import os, sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))
import Model

client = MongoClient('localhost')
db = client.seatswap

def get_user_by_email(email):
    users = db.users
    result = users.find_one({'email': email})
    return Model.User(result) if result else None

def get_user_by_id(user_id):
    users = db.users
    result = users.find_one({'_id': ObjectId(user_id)})
    return Model.User(result) if result else None

def add_user(user):
    users = db.users
    users.insert_one(user.__dict__)

def update_user(new_user):
    users = db.users
    new_id = ObjectId(new_user._id)
    new_user = new_user.__dict__
    del new_user['_id']
    users.update_one({'_id': new_id}, {'$set' : new_user})
    
def get_group_by_id(group_id):
    groups = db.groups
    result = groups.find_one({'_id': ObjectId(group_id)})
    return Model.Group(result) if result else None

def get_group_by_owner(owner_id, event_id):
    groups = db.groups
    result = groups.find_one({'owner_id': owner_id, 'event_id': event_id})
    return Model.Group(result) if result else None

def add_group(group):
    groups = db.groups
    groups.insert_one(group.__dict__)

def add_user_to_group(user_id, group):
    groups = db.groups
    members_list = group.members
    members_list.append(user_id)
    groups.update_one({'_id': ObjectId(group._id)}, {'$set': {'members': members_list}})

def remove_user_from_group(user_id, group):
    groups = db.groups
    members_list = group.members
    members_list.remove(user_id)
    groups.update_one({'_id': ObjectId(group._id)}, {'$set': {'members': members_list}})

def get_all_groups():
    groups = db.groups
    group_list = groups.find()
    return [Model.Group(g) for g in group_list]

def get_groups_with_user(user_id):
    groups = db.groups
    user_groups = groups.aggregate([{"$match": {'members': user_id}}])
    return [Model.Group(g) for g in user_groups]
