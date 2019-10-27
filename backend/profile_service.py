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
    if 'email' not in request.json:
        return {'invalid_key': 'Can only search for users by email'}, status.HTTP_400_BAD_REQUEST

    return {'user': db.get_user(request.json['email']).__dict__}

@profile.route('/login', methods=['POST'])
def processLogin():
    """
    Request: {"email" : <value>}

    Response: {"newUser" : <bool>, "user": <obj>}
    """
    if 'email' not in request.json:
        return {'invalid_key': 'Can only search for users by email'}, status.HTTP_400_BAD_REQUEST

    user = db.get_user(request.json['email'])
    if user:
        return {'newUser': False, 'user': user.__dict__}
    else:
        return {'newUser': True, 'user': None}

@profile.route('/addUser', methods=['POST'])
def add_user():
    """
    Request: {"user" : <obj>}

    Response: empty
    """
    if 'user' not in request.json:
        return {'invalid_user': 'No user given'}, status.HTTP_400_BAD_REQUEST
    if 'email' not in request.json['user']:
        return {'invalid_user': 'User must have an email'}, status.HTTP_400_BAD_REQUEST

    new_user = User(request.json['user'])
    if db.get_user(new_user.email):
        return {'already_exists': 'This user already exists'}, status.HTTP_400_BAD_REQUEST
    
    db.add_user(new_user)
    return "", status.HTTP_200_OK

@profile.route('/updateUser', methods=['POST'])
def update_user():
    """
    Request: {"user" : <obj>}

    Response: empty
    """
    if 'user' not in request.json:
        return {'invalid_user': 'No user given'}, status.HTTP_400_BAD_REQUEST
    if 'email' not in request.json['user']:
        return {'invalid_user': 'User must have an email'}, status.HTTP_400_BAD_REQUEST

    db.update_user(User(request.json['user']))
    return "", status.HTTP_200_OK