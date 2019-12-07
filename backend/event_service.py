import os, sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
import Repository as db
from ViewModel import jsonify, EventView

from flask_api import status
from flask import Blueprint, request

event = Blueprint('event', __name__)

@event.route('/futureEvents')
def get_future_events():
    """
    Parameters: none

    Response: {'events': [<event>]}
    """
    return jsonify({'events': db.get_all_future_events()})

@event.route('/events')
def get_future_events():
    """
    Parameters: eventId

    Response: {'event': <event>}
    """
    if 'eventId' not in request.args:
        return jsonify({'errorMessage': 'Event ID missing from request'}), status.HTTP_400_BAD_REQUEST
        
    event = db.get_event_by_id(request.args['eventId'])
    if event:
        return jsonify({'event': EventView(event)})
    else:
        return jsonify({'errorMessage': 'Could not find event with provided ID'}), status.HTTP_400_BAD_REQUEST
