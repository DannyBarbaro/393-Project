import sys
import os
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
from backend.Model import Group
from backend.SomethingCool import create_app
import db_code.Repository as db
import backend.group_service as service
import pytest

@pytest.fixture
def app():
        return create_app()

@pytest.fixture
def mock_add_group(mocker):
        return mocker.patch("Repository.add_group", return_value=None)

class TestCreateGroup_NewGroup(object):


    @pytest.fixture
    def mock_get_group(self, mocker):
        return mocker.patch("Repository.get_group_by_owner",
                            return_value=None)

    def test_create_group_success(self, client, mock_get_group, mock_add_group):
        url = '/createGroup'
        data = {
            'group': {
                'owner': 14,
                'event': 13,
            }
        }

        response = client.post(url, json=data)

        mock_get_group.assert_called()
        mock_add_group.assert_called()
        assert response.status_code == 200

    def test_create_group_no_group(self, client, mock_get_group):
        url = '/createGroup'
        data = {
            'notgroup': {
                'owner': 11,
                'event': 7,
            }
        }

        response = client.post(url, json=data)

        mock_get_group.assert_not_called()
        assert response.json['invalid_key'] == 'Invalid group creation request'
        assert response.status_code == 400

    def test_create_group_no_owner(self, client, mock_get_group):
        url = '/createGroup'
        data = {
            'group': {
                'oner': 'me',
                'event': 5,
            }
        }

        response = client.post(url, json=data)

        mock_get_group.assert_not_called()
        assert response.json['no_owner'] == 'No owner in group request'
        assert response.status_code == 400

    def test_create_group_no_event(self, client, mock_get_group):
        url = '/createGroup'
        data = {
            'group': {
                'owner': 4,
                'evening': '7pm'
            }
        }

        response = client.post(url, json=data)

        mock_get_group.assert_not_called()
        assert response.json['no_event'] == 'No event in group request'
        assert response.status_code == 400


class TestCreateGroup_AlreadyExists(object):

    @pytest.fixture
    def app(self):
        return create_app()

    @pytest.fixture
    def mock_get_group(self, mocker):
        group = Group({'owner': 4, 'event': 3})
        return mocker.patch("Repository.get_group_by_owner",
                     return_value=group)

    def test_create_group_already_exists(self, client, mock_get_group, mock_add_group):
        url = '/createGroup'
        data = {
            'group': {
                'owner': 4,
                'event': 3,
            }
        }

        response = client.post(url, json=data)

        mock_get_group.assert_called()
        mock_add_group.assert_not_called()
        assert response.json['group_exists'] == 'This group has been created already'
        assert response.status_code == 400

class TestGetGroup_Exists(object):
    
    def test_get_group(self):
        pass


def test_join_group():
    pass


def test_leave_group():
    pass


def test_get_all_groups():
    pass


def test_get_user_groups():
    pass
