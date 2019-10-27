import os, sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0] + 'db_code')))
import db_code.Repository as db

from flask import Blueprint, jsonify, request
from flask_api import status

from Model import User

profile = Blueprint('profile', __name__)

@profile.route('/profile')
def getProfile():
    """
    Request: {"email" : <value>}

    Response: {"user" : <obj>}
    """
    if 'email' not in request.args:
        return {'invalid_key': 'Can only search for users by email'}, status.HTTP_400_BAD_REQUEST

    return {'user': db.get_user(request.args['email']).__dict__}

@profile.route('/login')
def processLogin():
    """
    Request: {"email" : <value>}

    Response: {"newUser" : <bool>, "user": <obj>}
    """
    if 'email' not in request.args:
        return {'invalid_key': 'Can only search for users by email'}, status.HTTP_400_BAD_REQUEST

    user = db.get_user(request.args['email'])
    if user:
        return {'newUser': False, 'user': user.__dict__}
    else:
        return {'newUser': True, 'user': None}

@profile.route('/addUser')
def add_user():
    """
    Request: {"user" : <obj>}

    Response: empty
    """
    if 'email' not in request.args:
        return {'invalid_user': 'User must have an email'}, status.HTTP_400_BAD_REQUEST

    new_user = User(request.args['email'])
    if db.get_user(new_user.email):
        return {'already_exists': 'This user already exists'}, status.HTTP_400_BAD_REQUEST
    
    db.add_user(new_user)
    return status.HTTP_200_OK