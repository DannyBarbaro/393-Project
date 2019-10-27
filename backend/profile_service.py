import os, sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0] + 'db_code')))
import db_code.Repository as db

from flask import Blueprint, jsonify, request
from flask_api import status

profile = Blueprint('profile', __name__)

@profile.route('/profile')
def getProfile():
    if 'email' in request.args:
        return db.getUser(request.args['email'])

    return {'invalid key': 'Can only search for users by email'}, status.HTTP_400_BAD_REQUEST