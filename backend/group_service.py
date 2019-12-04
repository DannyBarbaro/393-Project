import os, sys
from Model import Group, UserSchedule
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
import Repository as db
from ViewModel import jsonify, GroupView

from flask_api import status
from flask import Blueprint, request

group = Blueprint('group', __name__)

@group.route('/createGroup', methods=['POST'])
def create_group():
    """
    Request: {"group" : <obj>}

    Response: {"groupId" : <val>}
    """
    if 'group' not in request.json:
        return {'invalid_key': 'Invalid group creation request'}, status.HTTP_400_BAD_REQUEST
    if 'ownerId' not in request.json['group']:
        return {'no_owner': 'No owner in group request'}, status.HTTP_400_BAD_REQUEST
    if 'eventId' not in request.json['group']:
        return {'no_event': 'No event in group request'}, status.HTTP_400_BAD_REQUEST
    
    new_group = Group(request.json['group'])
    if db.get_group_by_owner(new_group.owner_id, new_group.event_id):
        return {'group_exists': 'This group has been created already'}, status.HTTP_400_BAD_REQUEST
    db.add_group(new_group)
    group = GroupView(db.get_group_by_owner(new_group.owner_id, new_group.event_id))
    return jsonify({'groupId': group.id}), status.HTTP_200_OK

@group.route('/groups')
def get_group():
    """
    Parameters: id = <id>

    Response: {"group" : <obj>}
    """
    if 'id' not in request.args:
        return {'no_group_id': 'Group id missing from request'}, status.HTTP_400_BAD_REQUEST 

    group = db.get_group_by_id(request.args['id'])
    if group:
        return jsonify({'group': GroupView(group)})
    else:
        return jsonify({'group': None})

@group.route('/groups/join', methods=['POST'])
def join_group():
    """
    Request: {"groupId" : <id>, "userId" : <id>}

    Response: empty
    """
    if 'groupId' not in request.json:
        return {'no_group_id': 'Group id missing from request'}, status.HTTP_400_BAD_REQUEST
    if 'userId' not in request.json:
        return {'no_user_id': 'Joining user id missing from request'}, status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.json['groupId'])
    if group:
        if request.json['userId'] not in group.members:
            db.add_user_to_group(request.json['userId'], group)
            event = db.get_event(group.event_id)
            db.create_schedule(UserSchedule({'time_blocks': [None for _ in range(event.period_count)], 'owner': request.json['userId'], 'group_num': request.json['groupId']}))
            return "", status.HTTP_200_OK
        else:
            return {'already_member': 'User is already a member of this group'}, status.HTTP_400_BAD_REQUEST
    else:
        return {'group_not_found': 'Requested group could not be found'}, status.HTTP_400_BAD_REQUEST

@group.route('/groups/leave', methods=['POST'])
def leave_group():
    """
    Params: groupId = <id>, userId = <id>

    Response: empty
    """
    if 'groupId' not in request.json:
        return {'no_group_id': 'Group id missing from request'}, status.HTTP_400_BAD_REQUEST
    if 'userId' not in request.json:
        return {'no_user_id': 'Leaving user id missing from request'}, status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.json['groupId'])
    if group:
        if request.json['userId'] in group.members:
            db.remove_user_from_group(request.json['userId'], group)
            db.remove_schedule_of_user_in_group(request.json['userId'], request.json['groupId'])
            return "", status.HTTP_200_OK
        else:
            return {'user_not_in_group': 'User does not belong to specified group'}, status.HTTP_400_BAD_REQUEST
    else:
        return {'group_not_found': 'Requested group could not be found'}, status.HTTP_400_BAD_REQUEST

@group.route('/groups/list')
def get_all_groups():
    """
    Request: empty

    Response: {"groups" : [<obj>]}
    """
    return jsonify({'groups': [GroupView(g) for g in db.get_all_groups()]}), status.HTTP_200_OK

@group.route('/groups/mine')
def get_user_groups():
    """
    Params: "userId" = <id>

    Response: {"groups" : [<obj>]}
    """
    if 'userId' not in request.args:
        return {'no_user': 'User id missing from request'}, status.HTTP_400_BAD_REQUEST
    
    return jsonify({'groups': [GroupView(g) for g in db.get_groups_with_user(request.args['userId'])]}), status.HTTP_200_OK

