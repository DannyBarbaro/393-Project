import os, sys
from Model import UserSchedule
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
import Repository as db
from ViewModel import jsonify

from flask_api import status
from flask import Blueprint, request

schedule = Blueprint('schedule', __name__)

@schedule.route('/groupSchedules', methods=['GET'])
def get_schedules_for_group():
    """
    Parameters: groupId = <id>

    Response: {"schedules": [[<seat>]]}
    """
    if 'groupId' not in request.args:
        return jsonify({'errorMessage': 'Group id missing from request'}), status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.args['groupId'])
    if group:
        schedules = [ViewModel.UserScheduleView(x) for x in db.get_schedules_for_group(group.id)]
        return jsonify({'schedules': schedules})
    else:
        return jsonify({'errorMessage': "Requested group could not be found"}), status.HTTP_400_BAD_REQUEST

@schedule.route('/updateSchedule', methods=['POST'])
def update_schedule():
    """
    Request: {"groupId: <id>, "userId": <id>, seats: [<seat>]}

    Response: empty
    """
    if 'groupId' not in request.json:
        return jsonify({'errorMessage': 'Group id missing from request'}), status.HTTP_400_BAD_REQUEST
    if 'userId' not in request.json:
        return jsonify({'errorMessage': 'User id missing from request'}), status.HTTP_400_BAD_REQUEST
    if 'seats' not in request.json:
        return jsonify({'errorMessage': 'Schedule data missing from request'}), status.HTTP_400_BAD_REQUEST
    
    if db.get_schedules_of_user_in_group(request.json['userId'], request.json['groupId']):
        db.update_schedule_of_user_in_group(request.json['userId'], request.json['groupId'], request.json['seats'])
        return '', status.HTTP_200_OK
    else:
        return jsonify({'errorMessage': 'No schedule found for given user in given group'}), status.HTTP_400_BAD_REQUEST
