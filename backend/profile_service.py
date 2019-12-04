import os, sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
import Repository as db
from Model import User
from ViewModel import jsonify, UserView

from flask import Blueprint, request, send_file
from flask_api import status
import base64

profile = Blueprint('profile', __name__)

@profile.route('/profile')
def get_profile():
    """
    Params: userId = <value>

    Response: {"user" : <obj>}
    """
    if 'userId' not in request.args:
        return jsonify({'errorMessage': 'Can only search for users by ID'}), status.HTTP_400_BAD_REQUEST

    user = db.get_user_by_id(request.args['userId'])
    if user:
        return jsonify({'user': UserView(user)})
    else:
        return jsonify({'errorMessage': 'Could not find user with provided ID'}), status.HTTP_400_BAD_REQUEST

@profile.route('/login')
def process_login():
    """
    Params: email = <value>

    Response: {"newUser" : <bool>, "userId": <obj>}
    """
    if 'email' not in request.args:
        return jsonify({'errorMessage': 'Can only search for users by email'}), status.HTTP_400_BAD_REQUEST

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
        return jsonify({'errorMessage': 'No user given'}), status.HTTP_400_BAD_REQUEST
    if 'email' not in request.json['user']:
        return jsonify({'errorMessage': 'User must have an email'}), status.HTTP_400_BAD_REQUEST

    new_user = User(request.json['user'])
    if db.get_user_by_email(new_user.email):
        return jsonify({'errorMessage': 'This user already exists'}), status.HTTP_400_BAD_REQUEST
    
    db.add_user(new_user)
    new_user = db.get_user_by_email(new_user.email)
    return jsonify({'userId': new_user._id})

@profile.route('/profilePic', methods=['GET', 'POST'])
def get_profile_pic():
    """
    Params: userId = <value>

    Response: image or empty
    """
    if 'userId' not in request.args:
        return jsonify({'errorMessage': 'Can only search for profile picture by ID'}), status.HTTP_400_BAD_REQUEST
    
    user = db.get_user_by_id(request.args['userId'])
    if user:
        if request.method == 'GET':
            if hasattr(user, 'profilePic') :
                return jsonify({'profilePic': user.profilePic})
            else:
                return ''
        else:
            db.update_user_profile_pic(request.args['userId'], request.json['profilePic'])
            return "", status.HTTP_200_OK
    else:
        return jsonify({'errorMessage': 'Could not find user with provided ID'}), status.HTTP_400_BAD_REQUEST

@profile.route('/updateUser', methods=['POST'])
def update_user():
    """
    Request: {"user" : <obj>}

    Response: empty
    """
    if 'user' not in request.json:
        return jsonify({'errorMessage': 'No user given'}), status.HTTP_400_BAD_REQUEST
    if 'id' not in request.json['user']:
        return jsonify({'errorMessage': 'User must have an id'}), status.HTTP_400_BAD_REQUEST
        
    if db.get_user_by_id(request.json['user']['id']):
        db.update_user(User(request.json['user']))
        return "", status.HTTP_200_OK
    else:
        return jsonify({'errorMessage': 'No user with provided ID was found'}), status.HTTP_400_BAD_REQUEST


@profile.route('/users')
def get_many_usernames():
    """
    Params: id = <val> & id = <val> & ...

    Response: {"usernames" : [<str>]}
    """
    if 'id' not in request.args:
        return jsonify({'usernames': []})
    ids = request.args.getlist('id')
    users = [db.get_user_by_id(x) for x in ids]
    usernames = [UserView(user).name for user in users if user is not None]
    return jsonify({'usernames': usernames})
    