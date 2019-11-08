from Model import Group
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
import Repository as db
from ViewModel import jsonify, GroupView

from flask_api import status
from flask import Blueprint, request
import os
import sys

group = Blueprint('group', __name__)

@group.route('/createGroup', methods=['POST'])
def create_group():
    """
    Request: {"group" : <obj>}

    Response: empty
    """
    if 'group' not in request.json:
        return {'invalid_key': 'Invalid group creation request'}, status.HTTP_400_BAD_REQUEST
    if 'owner' not in request.json['group']:
        return {'no_owner': 'No owner in group request'}, status.HTTP_400_BAD_REQUEST
    if 'event' not in request.json['group']:
        return {'no_event': 'No event in group request'}, status.HTTP_400_BAD_REQUEST
    
    new_group = Group(request.json['group'])
    if db.get_group_by_owner(new_group.owner, new_group.event):
        return {'group_exists': 'This group has been created already'}, status.HTTP_400_BAD_REQUEST
    
    db.add_group(new_group)
    return "", status.HTTP_200_OK

@group.route('/groups')
def get_group(id):
    """
    Parameters: id = <id>

    Response: {"group" : <obj>}
    """
    group = db.get_group_by_id(id)
    if group:
        return jsonify({'group': GroupView(group)})
    else:
        return jsonfiy({'group': None})

@group.route('/groups/join', methods=['POST'])
def join_group():
    """
    Request: {"group_id" : <id>, "user_id" : <id>}

    Response: empty
    """
    if 'group_id' not in request.json:
        return {'no_group_id': 'Group id missing from request'}, status.HTTP_400_BAD_REQUEST
    if 'user_id' not in request.json:
        return {'no_user': 'Joining user id missing from request'}, status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.json['group_id'])
    if group:
        db.add_user_to_group(request.json['user_id'], group)
        return "", status.HTTP_200_OK
    else:
        return {'group_not_found': 'Requested group could not be found'}, status.HTTP_400_BAD_REQUEST

@group.route('/groups/leave')
def leave_group():
    """
    Params: group_id = <id>, user_id = <id>

    Response: empty
    """
    if 'group_id' not in request.args:
        return {'no_group_id': 'Group id missing from request'}, status.HTTP_400_BAD_REQUEST
    if 'user_id' not in request.args:
        return {'no_user': 'Leaving user missing from request'}, status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.args['group_id'])
    if group:
        if request.args['user_id'] in group.members:
            db.remove_user_from_group(request.args['user_id'], group)
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
    Parmas: "user_id" = <id>

    Response: {"groups" : [<obj>]}
    """
    if 'user_id' not in request.args:
        return {'no_user': 'User id missing from request'}, status.HTTP_400_BAD_REQUEST
    
    return jsonify({'groups': [GroupView(g) for g in db.get_groups_with_user(request.args['user'])]}), status.HTTP_200_OK

