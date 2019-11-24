import pytest
from backend.SomethingCool import create_app
from backend.ViewModel import UserView
from backend.Model import User
import sys
import os
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))


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
def mock_remove_user_from_group(mocker):
    return mocker.patch("Repository.remove_user_from_group", return_value=None)


class TestGetProfile_UserExists(object):
    url = '/profile?userId=13'

    @pytest.fixture
    def mock_get_user_by_id(self, mocker):
        user = User({'id': 13, 'email': 'hap@12.com'})
        return mocker.patch("Repository.get_user_by_id", return_value=user)

    def test_success(self, client, mock_get_user_by_id):
        response = client.get(self.url)

        mock_get_user_by_id.assert_called()
        assert b'"user": {"id": 13, "email": "hap@12.com"}' in response.data
        assert response.status_code == 200

class TestGetProfile_NoUser(object):
    url = '/profile?userId=13'

    def test_no_user_id(self, client, mock_get_user_by_id):
        url = '/profile?youSir=dashing'
        response = client.get(url)

        mock_get_user_by_id.assert_not_called()
        assert response.json['invalid_key'] == 'Can only search for users by ID'
        assert response.status_code == 400

    def test_no_such_user(self, client, mock_get_user_by_id):
        response = client.get(self.url)

        mock_get_user_by_id.assert_called()
        print(response)
        assert response.json['no_such_user'] == 'Could not find user with provided ID'
        assert response.status_code == 400

class TestProcessLogin_ExistingUser(object):
    url = '/login?email=gooo@ooo.com'

    @pytest.fixture
    def mock_get_user_by_email(self, mocker):
        user = User({'id': 9})
        return mocker.patch("Repository.get_user_by_email", return_value=user)

    def test_success(self, client, mock_get_user_by_email):
        response = client.get(self.url)

        mock_get_user_by_email.assert_called()
        assert b'"newUser": false, "userId": 9' in response.data
        assert response.status_code == 200

class TestProcessLogin_NewUser(object):
    url = '/login?email=new2u@skoo.do'

    def test_new_user(self, client, mock_get_user_by_email):
        response = client.get(self.url)

        mock_get_user_by_email.assert_called()
        assert b'"newUser": true, "userId": null' in response.data
        assert response.status_code == 200

class TestProcessLogin_NoUser(object):
    url = '/login?esnail=mail@mail.mail'

    def test_no_user_email(self, client, mock_get_user_by_email):
        response = client.get(self.url)

        mock_get_user_by_email.assert_not_called()
        assert response.json['invalid_key'] == 'Can only search for users by email'
        assert response.status_code == 400

class TestAddUser_NewUser(object):
    url = '/addUser'

    @pytest.fixture
    def mock_get_user_by_email(self, mocker):
        user = User({'id': 4, 'email': 'come@me.com'})
        return mocker.patch("Repository.get_user_by_email", side_effect=[None, user])

    def test_success(self, client, mock_get_user_by_email, mock_add_user):
        data = {
            'user': {
                'email': 'come@me.com'
            }
        }
        response = client.post(self.url, json=data)

        mock_add_user.assert_called()
        mock_get_user_by_email.assert_called()
        assert mock_get_user_by_email.call_count == 2
        assert b'"userId": 4' in response.data
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
        response.json['invalid_user'] == 'No user given'
        response.status_code == 400

    def test_no_email(self, client, mock_get_user_by_email, mock_add_user):
        data = {
            'user': {
                'box': 'package'
            }
        }
        response = client.post(self.url, json=data)

        mock_get_user_by_email.assert_not_called()
        mock_add_user.assert_not_called()
        response.json['invalid_user'] == 'User must have an email'
        response.status_code == 400

class TestAddUser_ExistingUser(object):
    url = '/addUser'

    @pytest.fixture
    def mock_get_user_by_email(self, mocker):
        user = User({'id': 7})
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
        response.json['already_exists'] == 'This user already exists'
        response.status_code == 400

class TestUpdateUser_UserExists(object):
    url = '/updateUser'

    @pytest.fixture
    def mock_get_user_by_id(self, mocker):
        user = User({'id': 6})
        return mocker.patch("Repository.get_user_by_id", return_value=user)

    def test_success(self, client, mock_get_user_by_id, mock_update_user):
        data = {
            'user': {
                'id': 3
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
        assert response.json['invalid_user'] == 'No user given'
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
        assert response.json['invalid_user'] == 'User must have an id'
        assert response.status_code == 400

class TestUpdateUser_NoSuchUser(object):
    url = '/updateUser'

    def test_no_such_user(self, client, mock_get_user_by_id, mock_update_user):
        data = {
            'user': {
                'id': 23
            }
        }
        response = client.post(self.url, json=data)

        mock_get_user_by_id.assert_called()
        mock_update_user.assert_not_called()
        assert response.json['user_not_found'] == 'No user with provided ID was found'
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
        assert b'usernames' in response.data

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