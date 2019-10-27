from Model import Group
from flask_api import status
from flask import Blueprint, jsonify, request
import db_code.Repository as db
import os
import sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0] + 'db_code')))


group = Blueprint('group', __name__)


@group.route('/createGroup')
def createGroup():
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

@group.route('/groups/<id>')
def getGroup():
    """
    Request: {"id" : <id>}

    Response: {"group" : <obj>}
    """
    if 'id' not in request.json:
        return {'no_id': 'No group id in request'}, status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.json['id'])
    if group:
        return {'group': group.__dict__}
    else:
        return {'group': None}

@group.route('/groups/<id>/join')
def joinGroup():
    """
    Request: {"id" : <id>, "user" : <obj>}

    Response: empty
    """
    if 'id' not in request.json:
        return {'no_group_id': 'Group id missing from request'}, status.HTTP_400_BAD_REQUEST
    if 'user' not in request.json:
        return {'no_user': 'Joining user missing from request'}, status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.json['id'])
    if group:
        db.add_user_to_group(request.json['user'], group)
        return "", status.HTTP_200_OK
    else:
        return {'group_not_found': 'Requested group could not be found'}, status.HTTP_400_BAD_REQUEST

@group.route('/groups/<id>/leave')
def leave_group():
    """
    Request: {"id" : <id>, "user" : <obj>}

    Response: empty
    """
    if 'id' not in request.json:
        return {'no_group_id': 'Group id missing from request'}, status.HTTP_400_BAD_REQUEST
    if 'user' not in request.json:
        return {'no_user': 'Leaving user missing from request'}, status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.json['id'])
    if group:
        if request.json['user'] in group.members:
            db.remove_user_from_group(request.json['user'], group)
            return "", status.HTTP_200_OK
        else:
            return {'user_not_in_group': 'User does not belong to specified group'}, status.HTTP_400_BAD_REQUEST
    else:
        return {'group_not_found': 'Requested group could not be found'}, status.HTTP_400_BAD_REQUEST

@group.route('/groups/mine')
def get_user_groups():
    """
    Request: {"user" : <obj>}

    Response: {"groups" : <objlist>}
    """
    if 'user' not in request.json:
        return {'no_user': 'User missing from request'}, status.HTTP_400_BAD_REQUEST
    
    return {'groups': db.get_groups_with_user(request.json['user'])}

