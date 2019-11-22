import os, sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
import Repository as db
from Model import User
from ViewModel import jsonify, UserView

from flask import Blueprint, request
from flask_api import status

profile = Blueprint('profile', __name__)

@profile.route('/profile')
def get_profile():
    """
    Params: userId = <value>

    Response: {"user" : <obj>}
    """
    if 'userId' not in request.args:
        return {'invalid_key': 'Can only search for users by ID'}, status.HTTP_400_BAD_REQUEST

    user = UserView(db.get_user_by_id(request.args['userId']))
    if user:
        return jsonify({'user': user})
    else:
        return {'no_such_user': 'Could not find user with provided ID'}, status.HTTP_400_BAD_REQUEST

@profile.route('/login')
def process_login():
    """
    Params: email = <value>

    Response: {"newUser" : <bool>, "userId": <obj>}
    """
    if 'email' not in request.args:
        return {'invalid_key': 'Can only search for users by email'}, status.HTTP_400_BAD_REQUEST

    user = db.get_user_by_email(request.args['email'])
    if user:
        return jsonify({'newUser': False, 'userId': UserView(user).id})
    else:

        return jsonify({'newUser': True, 'userId': None})

@profile.route('/addUser', methods=['POST'])
def add_user():
    """
    Request: {"user" : <obj>}

    Response: {userId: <str>}
    """
    if 'user' not in request.json:
        return {'invalid_user': 'No user given'}, status.HTTP_400_BAD_REQUEST
    if 'email' not in request.json['user']:
        return {'invalid_user': 'User must have an email'}, status.HTTP_400_BAD_REQUEST

    new_user = User(request.json['user'])
    if db.get_user_by_email(new_user.email):
        return {'already_exists': 'This user already exists'}, status.HTTP_400_BAD_REQUEST
    
    db.add_user(new_user)
    new_user = db.get_user_by_email(new_user.email)
    return jsonify({'userId': new_user._id})

@profile.route('/updateUser', methods=['POST'])
def update_user():
    """
    Request: {"user" : <obj>}

    Response: empty
    """
    if 'user' not in request.json:
        return {'invalid_user': 'No user given'}, status.HTTP_400_BAD_REQUEST
    if 'id' not in request.json['user']:
        return {'invalid_user': 'User must have an id'}, status.HTTP_400_BAD_REQUEST

    db.update_user(User(request.json['user']))
    return "", status.HTTP_200_OK