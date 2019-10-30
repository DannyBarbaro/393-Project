from pymongo import MongoClient

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
    result = users.find_one({'id': user_id})
    return Model.User(result) if result else None

def add_user(user):
    users = db.users
    users.insert_one(user.__dict__)

def update_user(new_user):
    users = db.users
    users.update_one({'email': new_user.email}, {'$set' : new_user.__dict__})
    
def get_group_by_id(group_id):
    groups = db.groups
    result = groups.find_one({'id': group_id})
    return Model.Group(result)

def get_group_by_owner(owner_id, event_id):
    groups = db.groups
    result = groups.find_one({'owner': owner_id, 'event': event_id})
    return Model.Group(result)

def add_group(group):
    groups = db.groups
    groups.insert_one(group.__dict__)

def add_user_to_group(user_id, group):
    groups = db.groups
    members_list = group.members
    members_list.append(user_id)
    groups.update_one({'id': group['id']}, {'$set': {'members': members_list}})

def remove_user_from_group(user_id, group):
    groups = db.groups
    members_list = group.members
    members_list.remove(user_id)
    groups.update_one({'id': group['id']}, {'$set': {'members': members_list}})

def get_all_groups():
    groups = db.groups
    group_list = groups.find()
    return [Model.Group(g).__dict__ for g in group_list]

def get_groups_with_user(user_id):
    groups = db.groups
    user_groups = groups.find({'members': user_id})
    return [Model.Group(g).__dict__ for g in user_groups]
