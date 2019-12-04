import os, sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
import Repository as db
from ViewModel import jsonify

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