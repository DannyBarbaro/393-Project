import os, sys
from Model import UserSchedule
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
import Repository as db
from ViewModel import jsonify
import Model
import ViewModel

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
        schedules = [ViewModel.UserScheduleView(x) for x in db.get_schedules_for_group(group._id)]
        return jsonify({'schedules': schedules})
    else:
        return jsonify({'errorMessage': "Requested group could not be found"}), status.HTTP_400_BAD_REQUEST

@schedule.route('/openSeats', methods=['GET'])
def get_open_seats_for_group():
    """
    Parameters: groupId = <id>, userId = <id>

    Response: {"openSeats": [[<seat>]]}
    """
    if 'groupId' not in request.args:
        return jsonify({'errorMessage': 'Group id missing from request'}), status.HTTP_400_BAD_REQUEST
    if 'userId' not in request.args:
        return jsonify({'errorMessage': 'User id missing from request'}), status.HTTP_400_BAD_REQUEST

    group = db.get_group_by_id(request.args['groupId'])
    if group:
        schedules = db.get_schedules_for_group(group._id)
        #TODO I'm hardcoding 4 quarters
        #initialize all seats to be open in all quarters
        open_seats = [[seat for seat in group.seats] for _ in range(4)]
        for schedule in schedules:
            for avail_quarter, scheduled in zip(open_seats, schedule.time_blocks):
                if scheduled in avail_quarter:
                    avail_quarter.remove(scheduled)

        user_sched = db.get_schedule_of_user_in_group(request.args['userId'], request.args['groupId'])
        open_seats = [['', selected] + ls for ls, selected in zip(open_seats, user_sched.time_blocks)]
        return jsonify({'openSeats': open_seats}), status.HTTP_200_OK

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
    
    if db.get_schedule_of_user_in_group(request.json['userId'], request.json['groupId']):
        db.update_schedule_of_user_in_group(request.json['userId'], request.json['groupId'], request.json['seats'])
        return '', status.HTTP_200_OK
    else:
        return jsonify({'errorMessage': 'No schedule found for given user in given group'}), status.HTTP_400_BAD_REQUEST
