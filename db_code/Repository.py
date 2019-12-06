from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime

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

def update_user_profile_pic(id, pic):
    users = db.users
    users.update_one({'_id': ObjectId(id)}, {'$set' : {'profilePic': pic}})

def update_user(new_user):
    users = db.users
    new_user = new_user.__dict__
    user_id = new_user['_id']
    del new_user['_id']
    users.update_one({'_id': user_id}, {'$set' : new_user})
    
def get_group_by_id(group_id):
    groups = db.groups
    result = groups.find_one({'_id': ObjectId(group_id)})
    return Model.Group(result) if result else None

def get_group_by_owner(owner_id, event_id):
    groups = db.groups
    result = groups.find_one({'owner_id': ObjectId(owner_id), 'event_id': ObjectId(event_id)})
    return Model.Group(result) if result else None

def add_group(group):
    groups = db.groups
    groups.insert_one(group.__dict__)

def remove_group(group_id):
    groups = db.groups
    groups.delete_many({'_id': ObjectId(group_id)})

def add_user_to_group(user_id, group):
    groups = db.groups
    members_list = group.members
    members_list.append(ObjectId(user_id))
    groups.update_one({'_id': group._id}, {'$set': {'members': members_list}})

def remove_user_from_group(user_id, group):
    groups = db.groups
    members_list = group.members
    members_list.remove(ObjectId(user_id))
    groups.update_one({'_id': group._id}, {'$set': {'members': members_list}})

def set_group_seats(group_id, seats):
    groups = db.groups
    groups.update_one({'_id': ObjectId(group_id)}, {'$set': {'seats': seats}})

def get_all_groups():
    groups = db.groups
    group_list = groups.find()
    return [Model.Group(g) for g in group_list]

def get_joinable_groups(user_id):
    groups = db.groups
    group_list = groups.aggregate([
        {'$match': 
            {'$and': [
                {'group_size': {'$gt': {'$size': 'members'}}}, 
                {'visibility': True},
                {'members': {'$ne': ObjectId(user_id)}}
            ]}
        }
    ])
    return [Model.Group(g) for g in group_list]

def get_groups_with_user(user_id):
    groups = db.groups
    user_groups = groups.aggregate([{"$match": {'members': ObjectId(user_id)}}])
    return [Model.Group(g) for g in user_groups]

def get_schedules_for_group(group_id):
    schedules = db.schedules
    group_schedules = schedules.find({'group_num': ObjectId(group_id)})
    return [Model.UserSchedule(s) for s in group_schedules]

def add_schedule(schedule):
    schedules = db.schedules
    schedules.insert_one(schedule.__dict__)

def get_schedule_of_user_in_group(user_id, group_id):
    schedules = db.schedules
    schedule = schedules.find_one({'owner': ObjectId(user_id), 'group_num': ObjectId(group_id)})
    return Model.UserSchedule(schedule) if schedule else None

def update_schedule_of_user_in_group(user_id, group_id, time_blocks):
    schedules = db.schedules
    schedules.update_one({'owner': ObjectId(user_id), 'group_num': ObjectId(group_id)}, {'$set': {'time_blocks': time_blocks}})

def remove_schedule_of_user_in_group(user_id, group_id):
    schedules = db.schedules
    schedules.delete_many({'owner': ObjectId(user_id), 'group_num': ObjectId(group_id)})

def add_event(event):
    events = db.events
    events.insert_one(event.__dict__)

def get_all_events():
    events = db.events
    return [Model.Event(e) for e in events.find()]

def get_all_future_events():
    events = db.events
    now = datetime.utcnow()
    future_events = events.aggregate([{"$match": {'start_time': {'$gt': now}}}])
    return [Model.Event(e) for e in future_events]

def get_event_by_id(event_id):
    events = db.events
    result = events.find_one({'_id': ObjectId(event_id)})
    return Model.Event(result) if result else None
