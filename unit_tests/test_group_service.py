import sys
import os
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))
from backend.Model import Group
from backend.ViewModel import GroupView
from backend.SomethingCool import create_app
import pytest

@pytest.fixture
def app():
    return create_app()

@pytest.fixture
def mock_add_group(mocker):
    return mocker.patch("Repository.add_group", return_value=None)

@pytest.fixture
def mock_add_user_to_group(mocker):
    return mocker.patch("Repository.add_user_to_group", return_value=None)

@pytest.fixture
def mock_get_group_by_id(mocker):
    return mocker.patch("Repository.get_group_by_id", return_value=None)

@pytest.fixture
def mock_get_group_by_owner(mocker):
    return mocker.patch("Repository.get_group_by_owner", return_value=None)

@pytest.fixture
def mock_remove_user_from_group(mocker):
    return mocker.patch("Repository.remove_user_from_group", return_value=None)

class TestCreateGroup_NewGroup(object):
    url = '/createGroup'

    @pytest.fixture
    def mock_get_group_by_owner(self, mocker):
        group = GroupView({'_id': '12'})
        return mocker.patch("Repository.get_group_by_owner", side_effect=[None, group])

    def test_success(self, client, mock_get_group_by_owner, mock_add_group):
        data = {
            'group': {
                'ownerId': '14',
                'eventId': '13',
            }
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_owner.assert_called()
        mock_add_group.assert_called()
        assert mock_get_group_by_owner.call_count == 2
        assert response.status_code == 200
        assert b'"groupId": "12"' in response.data

    def test_no_group_obj(self, client, mock_get_group_by_owner, mock_add_group):
        data = {
            'notgroup': {
                'ownerId': 11,
                'eventId': 7,
            }
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_owner.assert_not_called()
        mock_add_group.assert_not_called()
        assert response.json['invalid_key'] == 'Invalid group creation request'
        assert response.status_code == 400

    def test_no_owner_id(self, client, mock_get_group_by_owner, mock_add_group):
        data = {
            'group': {
                'oner': 'me',
                'eventId': 5,
            }
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_owner.assert_not_called()
        mock_add_group.assert_not_called()
        assert response.json['no_owner'] == 'No owner in group request'
        assert response.status_code == 400

    def test_no_event_id(self, client, mock_get_group_by_owner, mock_add_group):
        data = {
            'group': {
                'ownerId': 4,
                'evening': '7pm'
            }
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_owner.assert_not_called()
        mock_add_group.assert_not_called()
        assert response.json['no_event'] == 'No event in group request'
        assert response.status_code == 400


class TestCreateGroup_AlreadyExists(object):
    url = '/createGroup'

    @pytest.fixture
    def mock_get_group_by_owner(self, mocker):
        group = Group({'owner': 4, 'event': 3})
        return mocker.patch("Repository.get_group_by_owner",
                     return_value=group)

    def test_already_exists(self, client, mock_get_group_by_owner, mock_add_group):
        data = {
            'group': {
                'ownerId': 4,
                'eventId': 3,
            }
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_owner.assert_called()
        mock_add_group.assert_not_called()
        assert response.json['group_exists'] == 'This group has been created already'
        assert response.status_code == 400

class TestGetGroup_GroupExists(object):
    url = '/groups?id=8'
    
    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = GroupView({'id': 8})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    def test_no_group_id(self, client, mock_get_group_by_id):
        url = '/groups?myD=8'
        response = client.get(url)

        mock_get_group_by_id.assert_not_called()
        assert response.json['no_group_id'] == "Group id missing from request"
        assert response.status_code == 400

    def test_success(self, client, mock_get_group_by_id):
        response = client.get(self.url)

        mock_get_group_by_id.assert_called()
        assert b'"group": {"id": 8}' in response.data
        assert response.status_code == 200

class TestGetGroup_NoSuchGroup(object):
    url = '/groups?id=8'

    def test_no_such_group(self, client, mock_get_group_by_id):
        response = client.get(self.url)

        mock_get_group_by_id.assert_called()
        assert b'"group": null' in response.data
        assert response.status_code == 200

class TestJoinGroup_GroupExists(object):
    url = '/groups/join'

    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = Group({'id': 5, 'members': [7, 10]})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    def test_no_group_id(self, client, mock_get_group_by_id, mock_add_user_to_group):
        data = {
            'groop': 5,
            'userId': 1,
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_not_called()
        mock_add_user_to_group.assert_not_called()
        assert response.json['no_group_id'] == 'Group id missing from request'
        assert response.status_code == 400

    def test_no_user_id(self, client, mock_get_group_by_id, mock_add_user_to_group):
        data = {
            'groupId': 5,
            'firstNumber': 1,
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_not_called()
        mock_add_user_to_group.assert_not_called()
        assert response.json['no_user_id'] == 'Joining user id missing from request'
        assert response.status_code == 400

    def test_success(self, client, mock_get_group_by_id, mock_add_user_to_group):
        data = {
            'groupId': 5,
            'userId': 1,
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_add_user_to_group.assert_called()
        assert response.status_code == 200

    def test_already_member(self, client, mock_get_group_by_id, mock_add_user_to_group):
        data = {
            'groupId': 5,
            'userId': 7,
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_add_user_to_group.assert_not_called()
        assert response.json['already_member'] == 'User is already a member of this group'
        assert response.status_code == 400

class TestJoinGroup_NoSuchGroup(object):
    url = '/groups/join'

    def test_no_such_group(self, client, mock_get_group_by_id, mock_add_user_to_group):
        data = {
            'groupId': 4,
            'userId': 42,
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_add_user_to_group.assert_not_called()
        assert response.json['group_not_found'] == 'Requested group could not be found'
        assert response.status_code == 400

class TestLeaveGroup_GroupExists(object):
    url = '/groups/leave'

    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = Group({'id': 9, 'members': [3, 11]})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    def test_success(self, client, mock_get_group_by_id, mock_remove_user_from_group):
        data = {
            'groupId': 9,
            'userId': 3,
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_remove_user_from_group.assert_called()
        assert response.status_code == 200

    def test_no_group_id(self, client, mock_get_group_by_id, mock_remove_user_from_group):
        data = {
            'grouper': 'filet',
            'userId': 3,
        }
        response = client.post(self.url, json=data)
        
        mock_get_group_by_id.assert_not_called()
        mock_remove_user_from_group.assert_not_called()
        assert response.json['no_group_id'] == 'Group id missing from request'
        assert response.status_code == 400

    def test_no_user_id(self, client, mock_get_group_by_id, mock_remove_user_from_group):
        data = {
            'groupId': 9,
            'vsauce': 'michael here',
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_not_called()
        mock_remove_user_from_group.assert_not_called()
        assert response.json['no_user_id'] == 'Leaving user id missing from request'
        assert response.status_code == 400

    def test_not_in_group(self, client, mock_get_group_by_id, mock_remove_user_from_group):
        data = {
            'groupId': 9,
            'userId': 6,
        }
        response = client.post(self.url, json=data)

        assert response.json['user_not_in_group'] == 'User does not belong to specified group'
        assert response.status_code == 400
        mock_get_group_by_id.assert_called()
        mock_remove_user_from_group.assert_not_called()

class TestLeaveGroup_NoSuchGroup(object):
    url = '/groups/leave'

    def test_no_such_group(self, client, mock_get_group_by_id, mock_remove_user_from_group):
        data = {
            'groupId': 11,
            'userId': 3,
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_remove_user_from_group.assert_not_called()
        assert response.json['group_not_found'] == 'Requested group could not be found'
        assert response.status_code == 400

class TestGetAllGroups(object):
    url = '/groups/list'

    @pytest.fixture
    def mock_get_all_groups(self, mocker):
        groups = [Group({'id': 4}), Group({'id': 16})]
        return mocker.patch("Repository.get_all_groups", return_value=groups)

    def test_success(self, client, mock_get_all_groups):
        response = client.get(self.url)

        mock_get_all_groups.assert_called()
        assert b'"groups": [{"id": 4}, {"id": 16}]' in response.data
        assert response.status_code == 200

class TestGetUserGroups(object):
    url = '/groups/mine?userId=23'

    @pytest.fixture
    def mock_get_groups_with_user(self, mocker):
        groups = [Group({'id': 18}), Group({'id': 51})]
        return mocker.patch("Repository.get_groups_with_user", return_value=groups)

    def test_no_user_id(self, client, mock_get_groups_with_user):
        url = '/groups/mine?disturbed=areyouready'
        response = client.get(url)

        mock_get_groups_with_user.assert_not_called()
        assert response.json['no_user'] == 'User id missing from request'
        assert response.status_code == 400

    def test_success(self, client, mock_get_groups_with_user):
        response = client.get(self.url)

        mock_get_groups_with_user.assert_called()
        assert b'"groups": [{"id": 18}, {"id": 51}]' in response.data
