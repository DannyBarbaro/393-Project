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

class TestAddUser(object):
    pass
    
