import sys
import os
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
from backend.Model import Group
from backend.ViewModel import GroupView
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

@pytest.fixture
def mock_join_group(mocker):
        return mocker.patch("Repository.add_user_to_group", return_value=None)

@pytest.fixture
def mock_get_group_by_id(mocker):
    return mocker.patch("Repository.get_group_by_id", return_value=None)

@pytest.fixture
def mock_get_group_by_owner(mocker):
    return mocker.patch("Repository.get_group_by_owner", return_value=None)

class TestCreateGroup_NewGroup(object):

    def test_create_group_success(self, client, mock_get_group_by_owner, mock_add_group):
        url = '/createGroup'
        data = {
            'group': {
                'owner': 14,
                'event': 13,
            }
        }

        response = client.post(url, json=data)

        mock_get_group_by_owner.assert_called()
        mock_add_group.assert_called()
        assert response.status_code == 200

    def test_create_group_no_group(self, client, mock_get_group_by_owner, mock_add_group):
        url = '/createGroup'
        data = {
            'notgroup': {
                'owner': 11,
                'event': 7,
            }
        }

        response = client.post(url, json=data)

        mock_get_group_by_owner.assert_not_called()
        mock_add_group.assert_not_called()
        assert response.json['invalid_key'] == 'Invalid group creation request'
        assert response.status_code == 400

    def test_create_group_no_owner(self, client, mock_get_group_by_owner, mock_add_group):
        url = '/createGroup'
        data = {
            'group': {
                'oner': 'me',
                'event': 5,
            }
        }

        response = client.post(url, json=data)

        mock_get_group_by_owner.assert_not_called()
        mock_add_group.assert_not_called()
        assert response.json['no_owner'] == 'No owner in group request'
        assert response.status_code == 400

    def test_create_group_no_event(self, client, mock_get_group_by_owner, mock_add_group):
        url = '/createGroup'
        data = {
            'group': {
                'owner': 4,
                'evening': '7pm'
            }
        }

        response = client.post(url, json=data)

        mock_get_group_by_owner.assert_not_called()
        mock_add_group.assert_not_called()
        assert response.json['no_event'] == 'No event in group request'
        assert response.status_code == 400


class TestCreateGroup_AlreadyExists(object):

    @pytest.fixture
    def mock_get_group_by_owner(self, mocker):
        group = Group({'owner': 4, 'event': 3})
        return mocker.patch("Repository.get_group_by_owner",
                     return_value=group)

    def test_create_group_already_exists(self, client, mock_get_group_by_owner, mock_add_group):
        url = '/createGroup'
        data = {
            'group': {
                'owner': 4,
                'event': 3,
            }
        }

        response = client.post(url, json=data)

        mock_get_group_by_owner.assert_called()
        mock_add_group.assert_not_called()
        assert response.json['group_exists'] == 'This group has been created already'
        assert response.status_code == 400

class TestGetGroup_GroupExists(object):
    
    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = GroupView({'id': 8})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    def test_get_group_no_group_id(self, client, mock_get_group_by_id):
        url = '/groups?myD=8'

        response = client.get(url)

        mock_get_group_by_id.assert_not_called()
        assert response.json['no_group_id'] == "Group id missing from request"
        assert response.status_code == 400

    def test_get_group_success(self, client, mock_get_group_by_id):
        url = '/groups?id=8'

        response = client.get(url)

        mock_get_group_by_id.assert_called()
        assert b'"group": {"id": 8}' in response.data
        assert response.status_code == 200

class TestGetGroup_NoSuchGroup(object):

    def test_get_group_no_such_group(self, client, mock_get_group_by_id):
        url = '/groups?id=8'

        response = client.get(url)

        mock_get_group_by_id.assert_called()
        assert b'"group": null' in response.data
        assert response.status_code == 200

class TestJoinGroup_GroupExists(object):

    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = Group({'id': 5, 'members': [7, 10]})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    def test_join_group_no_group(self, client, mock_get_group_by_id, mock_join_group):
        url = '/groups/join'
        data = {
            'groop': 5,
            'userId': 1,
        }

        response = client.post(url, json=data)

        mock_get_group_by_id.assert_not_called()
        mock_join_group.assert_not_called()
        assert response.json['no_group_id'] == 'Group id missing from request'
        assert response.status_code == 400

    def test_join_group_no_user(self, client, mock_get_group_by_id, mock_join_group):
        url = '/groups/join'
        data = {
            'groupId': 5,
            'firstNumber': 1,
        }

        response = client.post(url, json=data)

        mock_get_group_by_id.assert_not_called()
        mock_join_group.assert_not_called()
        assert response.json['no_user_id'] == 'Joining user id missing from request'
        assert response.status_code == 400

    def test_join_group_success(self, client, mock_get_group_by_id, mock_join_group):
        url = '/groups/join'
        data = {
            'groupId': 5,
            'userId': 1,
        }

        response = client.post(url, json=data)

        mock_get_group_by_id.assert_called()
        mock_join_group.assert_called()
        assert response.status_code == 200

    def test_join_group_already_member(self, client, mock_get_group_by_id, mock_join_group):
        url = '/groups/join'
        data = {
            'groupId': 5,
            'userId': 7,
        }

        response = client.post(url, json=data)

        mock_get_group_by_id.assert_called()
        mock_join_group.assert_not_called()
        assert response.json['already_member'] == 'User is already a member of this group'
        assert response.status_code == 400

class TestJoinGroup_NoSuchGroup(object):

    def test_join_group_no_such_group(self, client, mock_get_group_by_id, mock_join_group):
        url = 'groups/join'
        data = {
            'groupId': 4,
            'userId': 42,
        }

        response = client.post(url, json=data)

        mock_get_group_by_id.assert_called()
        mock_join_group.assert_not_called()
        assert response.json['group_not_found'] == 'Requested group could not be found'
        assert response.status_code == 400


def test_join_group():
    pass


def test_leave_group():
    pass


def test_get_all_groups():
    pass


def test_get_user_groups():
    pass
