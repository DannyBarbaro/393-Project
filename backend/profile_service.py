sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
import Repository as db
from Model import User
from ViewModel import ViewEncoder, UserView

from flask import Blueprint, request
from flask_api import status
import json
import os, sys

profile = Blueprint('profile', __name__)

def _to_json(view):
    return json.dumps(view, cls=ViewEncoder)

@profile.route('/profile')
def get_profile():
    """
    Params: email = <value>

    Response: {"user" : <obj>}
    """
    if 'email' not in request.args:
        return {'invalid_key': 'Can only search for users by email'}, status.HTTP_400_BAD_REQUEST

    return _to_json({'user': UserView(db.get_user_by_email(request.args['email']))})

@profile.route('/login')
def process_login():
    """
    Params: email = <value>

    Response: {"newUser" : <bool>, "user": <obj>}
    """
    if 'email' not in request.args:
        return {'invalid_key': 'Can only search for users by email'}, status.HTTP_400_BAD_REQUEST

    user = db.get_user_by_email(request.args['email'])
    if user:
        return _to_json({'newUser': False, 'user': UserView(user)})
    else:
        return _to_json({'newUser': True, 'user': None})

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
    if db.get_user_by_email(new_user.email):
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