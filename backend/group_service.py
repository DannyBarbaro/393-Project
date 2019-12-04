import os, sys
from Model import Group
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
        return jsonify({'errorMessage': 'Invalid group creation request'}), status.HTTP_400_BAD_REQUEST
    if 'ownerId' not in request.json['group']:
        return jsonify({'errorMessage': 'No owner in group request'}), status.HTTP_400_BAD_REQUEST
    if 'eventId' not in request.json['group']:
        return jsonify({'errorMessage': 'No event in group request'}), status.HTTP_400_BAD_REQUEST
    
    new_group = Group(request.json['group'])
    if db.get_group_by_owner(new_group.owner_id, new_group.event_id):
        return jsonify({'errorMessage': 'This group has been created already'}), status.HTTP_400_BAD_REQUEST
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
        return jsonify({'errorMessage': 'Group id missing from request'}), status.HTTP_400_BAD_REQUEST 

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
        return jsonify({'errorMessage': 'Group id missing from request'}), status.HTTP_400_BAD_REQUEST
    if 'userId' not in request.json:
        return jsonify({'errorMessage': 'Joining user id missing from request'}), status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.json['groupId'])
    if group:
        if request.json['userId'] not in group.members:
            db.add_user_to_group(request.json['userId'], group)
            return "", status.HTTP_200_OK
        else:
            return jsonify({'errorMessage': 'User is already a member of this group'}), status.HTTP_400_BAD_REQUEST
    else:
        return jsonify({'errorMessage': 'Requested group could not be found'}), status.HTTP_400_BAD_REQUEST

@group.route('/groups/leave', methods=['POST'])
def leave_group():
    """
    Params: groupId = <id>, userId = <id>

    Response: empty
    """
    if 'groupId' not in request.json:
        return jsonify({'errorMessage': 'Group id missing from request'}), status.HTTP_400_BAD_REQUEST
    if 'userId' not in request.json:
        return json({'errorMessage': 'Leaving user id missing from request'}), status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.json['groupId'])
    if group:
        if request.json['userId'] in group.members:
            db.remove_user_from_group(request.json['userId'], group)
            return "", status.HTTP_200_OK
        else:
            return jsonify({'errorMessage': 'User does not belong to specified group'}), status.HTTP_400_BAD_REQUEST
    else:
        return jsonify({'errorMessage': 'Requested group could not be found'}), status.HTTP_400_BAD_REQUEST

@group.route('/groups/list')
def get_all_groups():
    """
    Request: empty

    Response: {"groups" : [<obj>]}
    """
    groups = []
    for g in db.get_all_groups():
        groupModel = GroupView(g)
        event = None
        if hasattr(groupModel, 'eventId'):
            event = db.get_event_by_id(groupModel.eventId)
        groupModel.__setattr__('eventName', event.event if event != None else 'UNKNOWN EVENT')
        owner = None
        if hasattr(groupModel, 'ownerId'):
            owner = db.get_user_by_id(groupModel.ownerId)
        groupModel.__setattr__('ownerName', owner.name if owner != None else 'NO OWNER')
        groups.append(groupModel)
    return jsonify({'groups': groups}), status.HTTP_200_OK

@group.route('/groups/mine')
def get_user_groups():
    """
    Params: "userId" = <id>

    Response: {"groups" : [<obj>]}
    """
    if 'userId' not in request.args:
        return jsonify({'errorMessage': 'User id missing from request'}), status.HTTP_400_BAD_REQUEST
    
    return jsonify({'groups': [GroupView(g) for g in db.get_groups_with_user(request.args['userId'])]}), status.HTTP_200_OK

