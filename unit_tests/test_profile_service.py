import sys
import os
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))
import pytest
from backend.backend import create_app
from backend.ViewModel import UserView
from backend.Model import User


@pytest.fixture
def app():
    return create_app()

@pytest.fixture
def mock_get_user_by_id(mocker):
    return mocker.patch("Repository.get_user_by_id", return_value=None)

@pytest.fixture
def mock_get_user_by_email(mocker):
    return mocker.patch("Repository.get_user_by_email", return_value=None)


@pytest.fixture
def mock_add_user(mocker):
    return mocker.patch("Repository.add_user", return_value=None)


@pytest.fixture
def mock_update_user(mocker):
    return mocker.patch("Repository.update_user", return_value=None)

@pytest.fixture
def mock_update_user_profile_pic(mocker):
    return mocker.patch("Repository.update_user_profile_pic", return_value=None)


class TestGetProfile_UserExists:
    url = '/profile?userId=13'

    @pytest.fixture
    def mock_get_user_by_id(self, mocker):
        user = User({'id': "bebebebebebebebebebebebe", 'email': 'hap@12.com'})
        return mocker.patch("Repository.get_user_by_id", return_value=user)

    def test_success(self, client, mock_get_user_by_id):
        response = client.get(self.url)

        mock_get_user_by_id.assert_called()
        assert b'"user": {"id": "bebebebebebebebebebebebe", "email": "hap@12.com"}' in response.data
        assert response.status_code == 200

class TestGetProfile_NoUser:
    url = '/profile?userId=13'

    def test_no_user_id(self, client, mock_get_user_by_id):
        url = '/profile?youSir=dashing'
        response = client.get(url)

        mock_get_user_by_id.assert_not_called()
        assert b'"errorMessage": "Can only search for users by ID"' in response.data
        assert response.status_code == 400

    def test_no_such_user(self, client, mock_get_user_by_id):
        response = client.get(self.url)

        mock_get_user_by_id.assert_called()
        print(response)
        assert b'"errorMessage": "Could not find user with provided ID"' in response.data
        assert response.status_code == 400

class TestProcessLogin_ExistingUser:
    url = '/login?email=gooo@ooo.com'

    @pytest.fixture
    def mock_get_user_by_email(self, mocker):
        user = User({'id': "123456789012345678901234"})
        return mocker.patch("Repository.get_user_by_email", return_value=user)

    def test_success(self, client, mock_get_user_by_email):
        response = client.get(self.url)

        mock_get_user_by_email.assert_called()
        assert b'"newUser": false, "userId": "123456789012345678901234' in response.data
        assert response.status_code == 200

class TestProcessLogin_NewUser:
    url = '/login?email=new2u@skoo.do'

    def test_new_user(self, client, mock_get_user_by_email):
        response = client.get(self.url)

        mock_get_user_by_email.assert_called()
        assert b'"newUser": true, "userId": null' in response.data
        assert response.status_code == 200

class TestProcessLogin_NoUser:
    url = '/login?esnail=mail@mail.mail'

    def test_no_user_email(self, client, mock_get_user_by_email):
        response = client.get(self.url)

        mock_get_user_by_email.assert_not_called()
        assert b'"errorMessage": "Can only search for users by email"' in response.data
        assert response.status_code == 400

class TestAddUser_NewUser:
    url = '/addUser'

    @pytest.fixture
    def mock_get_user_by_email(self, mocker):
        user = User({'id': "123412341234123412341234", 'email': 'come@me.bro'})
        return mocker.patch("Repository.get_user_by_email", side_effect=[None, user])

    def test_success(self, client, mock_get_user_by_email, mock_add_user):
        data = {
            'user': {
                'email': 'come@me.bro'
            }
        }
        response = client.post(self.url, json=data)

        mock_add_user.assert_called()
        mock_get_user_by_email.assert_called()
        assert mock_get_user_by_email.call_count == 2
        assert b'"userId": "123412341234123412341234"' in response.data
        assert response.status_code == 200

    def test_no_user(self, client, mock_get_user_by_email, mock_add_user):
        data = {
            'caaaaarrrrrl': {
                'hat': 'pointy',
                'hit_count': 9865489553
            }
        }
        response = client.post(self.url, json=data)

        mock_get_user_by_email.assert_not_called()
        mock_add_user.assert_not_called() 
        assert b'"errorMessage": "No user given"' in response.data
        assert response.status_code == 400

    def test_no_email(self, client, mock_get_user_by_email, mock_add_user):
        data = {
            'user': {
                'box': 'package'
            }
        }
        response = client.post(self.url, json=data)

        mock_get_user_by_email.assert_not_called()
        mock_add_user.assert_not_called()
        assert b'"errorMessage": "User must have an email"' in response.data
        assert response.status_code == 400

class TestAddUser_ExistingUser:
    url = '/addUser'

    @pytest.fixture
    def mock_get_user_by_email(self, mocker):
        user = User({'id': "890890890890890890890890"})
        return mocker.patch("Repository.get_user_by_email", return_value=user)

    def test_user_exists(self, client, mock_get_user_by_email, mock_add_user):
        data = {
            'user': {
                'email': 'howard@fpou.edu'
            }
        }
        response = client.post(self.url, json=data)

        mock_get_user_by_email.assert_called()
        mock_add_user.assert_not_called()
        assert b'"errorMessage": "This user already exists"' in response.data
        assert response.status_code == 400

class TestProfilePic_NoSuchUser:
    url = '/profilePic?userId=cccccccccccccccccccccccc'

    def test_user_not_found(self, client, mock_get_user_by_id):
        response = client.get(self.url)
        mock_get_user_by_id.assert_called()
        assert b'"errorMessage": "Could not find user with provided ID"' in response.data
        assert response.status_code == 400

class TestProfilePic_NoPicForUser:
    url = '/profilePic?userId=cccccccccccccccccccccccc'

    @pytest.fixture
    def mock_get_user_by_id(self, mocker):
        user = User({})
        return mocker.patch("Repository.get_user_by_id", return_value=user)

    def test_no_pic(self, client, mock_get_user_by_id):
        response = client.get(self.url)

        mock_get_user_by_id.assert_called()
        assert b'profilePic' not in response.data
        assert response.status_code == 200

class TestProfilePic_GetPic:
    url = '/profilePic?userId=cccccccccccccccccccccccc'

    @pytest.fixture
    def mock_get_user_by_id(self, mocker):
        user = User({'profilePic': "pic goes here"})
        return mocker.patch("Repository.get_user_by_id", return_value=user)

    def test_no_user_id(self, client, mock_get_user_by_id):
        url = '/profilePic'
        response = client.get(url)

        mock_get_user_by_id.assert_not_called()
        assert b'"errorMessage": "Can only search for profile picture by ID"' in response.data
        assert response.status_code == 400

    def test_success(self, client, mock_get_user_by_id):
        response = client.get(self.url)

        mock_get_user_by_id.assert_called()
        assert b'"profilePic": "pic goes here"' in response.data
        assert response.status_code == 200

class TestProfilePic_UploadPic:
    url = '/profilePic?userId=cccccccccccccccccccccccc'

    @pytest.fixture
    def mock_get_user_by_id(self, mocker):
        user = User({})
        return mocker.patch("Repository.get_user_by_id", return_value=user)

    def test_update_pic(self, client, mock_get_user_by_id, mock_update_user_profile_pic):
        data = {
            'profilePic': 'newer, more flattering pic'
        }
        response = client.post(self.url, json=data)

        mock_get_user_by_id.assert_called()
        mock_update_user_profile_pic.assert_called()
        assert response.status_code == 200

class TestUpdateUser_UserExists:
    url = '/updateUser'

    @pytest.fixture
    def mock_get_user_by_id(self, mocker):
        user = User({'id': "567567567567567567567567"})
        return mocker.patch("Repository.get_user_by_id", return_value=user)

    def test_success(self, client, mock_get_user_by_id, mock_update_user):
        data = {
            'user': {
                'id': "567567567567567567567567"
            }
        }
        response = client.post(self.url, json=data)

        mock_get_user_by_id.assert_called()
        mock_update_user.assert_called()
        assert response.status_code == 200

    def test_no_user(self, client, mock_get_user_by_id, mock_update_user):
        data = {
            'ooser': {
                'name': 'jepph'
            }
        }
        response = client.post(self.url, json=data)

        mock_get_user_by_id.assert_not_called()
        mock_update_user.assert_not_called()
        assert b'"errorMessage": "No user given"' in response.data
        assert response.status_code == 400

    def test_no_id(self, client, mock_get_user_by_id, mock_update_user):
        data = {
            'user': {
                'eye dee': 3
            }
        }
        response = client.post(self.url, json=data)

        mock_get_user_by_id.assert_not_called()
        mock_update_user.assert_not_called()
        assert b'"errorMessage": "User must have an id"' in response.data
        assert response.status_code == 400

class TestUpdateUser_NoSuchUser:
    url = '/updateUser'

    def test_no_such_user(self, client, mock_get_user_by_id, mock_update_user):
        data = {
            'user': {
                'id': "aeaeaeaeaeaeaeaeaeaeaeae"
            }
        }
        response = client.post(self.url, json=data)

        mock_get_user_by_id.assert_called()
        mock_update_user.assert_not_called()
        assert b'"errorMessage": "No user with provided ID was found"' in response.data
        assert response.status_code == 400

class TestGetManyUsers:

    users = {
        '1': {'name': 'Alice'},
        '2': {'name': 'Bob'},
        '3': {'name': 'Charlie'}
    }
    
    @pytest.fixture
    def mock_get_user_by_id(self, mocker):
        return mocker.patch("Repository.get_user_by_id", side_effect=lambda x: self.users.get(x, None))

    def test_get_all_users(self, client, mock_get_user_by_id):
        url = '/users?id=1&id=2&id=3'
        response = client.get(url)

        assert mock_get_user_by_id.call_count == 3
        assert response.status_code == 200
        assert b'Alice' in response.data
        assert b'Bob' in response.data
        assert b'Charlie' in response.data
        assert b'"usernames":' in response.data

    def test_get_no_users(self, client, mock_get_user_by_id):
        url = '/users?'
        response = client.get(url)

        mock_get_user_by_id.assert_not_called()
        assert response.status_code == 200
        assert b'"usernames": []' in response.data

    def test_nonexistent_users(self, client, mock_get_user_by_id):
        url = '/users?id=2&id=4'
        response = client.get(url)

        assert mock_get_user_by_id.call_count == 2
        assert b'"usernames": ["Bob"]' in response.data
