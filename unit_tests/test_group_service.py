import sys
import os
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))
from backend.Model import Group, Event, User
from backend.ViewModel import GroupView
from backend.backend import create_app
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

@pytest.fixture
def mock_get_event_by_id(mocker):
    return mocker.patch("Repository.get_event_by_id", return_value=None)

@pytest.fixture
def mock_add_schedule(mocker):
    return mocker.patch("Repository.add_schedule", return_value=None)

@pytest.fixture
def mock_remove_schedule_of_user_in_group(mocker):
    return mocker.patch("Repository.remove_schedule_of_user_in_group", return_value=None)

@pytest.fixture
def mock_remove_group(mocker):
    return mocker.patch("Repository.remove_group", return_value=None)

@pytest.fixture
def mock_get_all_groups(mocker):
    return mocker.patch("Repository.get_all_groups", return_value=None)

@pytest.fixture
def mock_get_user_by_id(mocker):
    return mocker.patch("Repository.get_user_by_id", return_value=None)

@pytest.fixture
def mock_add_approval_for_group(mocker):
    return mocker.patch("Repository.add_approval_for_group", return_value=None)

@pytest.fixture
def mock_remove_approvals_for_group(mocker):
    return mocker.patch("Repository.remove_approvals_for_group", return_value=None)

@pytest.fixture
def mock_add_rated_for_group(mocker):
    return mocker.patch("Repository.add_rated_for_group", return_value=None)

class TestCreateGroup_NewGroup:
    url = '/createGroup'

    @pytest.fixture
    def mock_get_group_by_owner(self, mocker):
        group = GroupView({'_id': "121212121212121212121212"})
        return mocker.patch("Repository.get_group_by_owner", side_effect=[None, group])

    @pytest.fixture
    def mock_get_event_by_id(self, mocker):
        event = Event({'period_count': 3})
        return mocker.patch("Repository.get_event_by_id", return_value=event)

    def test_success(self, client, mock_get_group_by_owner, mock_add_group, mock_get_event_by_id, mock_add_schedule):
        data = {
            'group': {
                'ownerId': 'dddddddddddddddddddddddd',
                'eventId': 'cccccccccccccccccccccccc',
            }
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_owner.assert_called()
        mock_add_group.assert_called()
        assert mock_get_group_by_owner.call_count == 2
        mock_get_event_by_id.assert_called()
        mock_add_schedule.assert_called()
        assert response.status_code == 200
        assert b'"groupId": "121212121212121212121212"' in response.data

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
        assert b'"errorMessage": "Invalid group creation request"' in response.data
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
        assert b'"errorMessage": "No owner in group request"' in response.data
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
        assert b'"errorMessage": "No event in group request"' in response.data
        assert response.status_code == 400

class TestCreateGroup_AlreadyExists:
    url = '/createGroup'

    @pytest.fixture
    def mock_get_group_by_owner(self, mocker):
        group = Group({'owner': 4, 'event': 3})
        return mocker.patch("Repository.get_group_by_owner",
                     return_value=group)

    def test_already_exists(self, client, mock_get_group_by_owner, mock_add_group):
        data = {
            'group': {
                'ownerId': 'aaaaaaaaaaaaaaaaaaaaaaaa',
                'eventId': 'bbbbbbbbbbbbbbbbbbbbbbbb',
            }
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_owner.assert_called()
        mock_add_group.assert_not_called()
        assert b'"errorMessage": "This group has been created already"' in response.data
        assert response.status_code == 400

class TestGetGroup_GroupExists:
    url = '/groups?id=8'
    
    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = GroupView({'id': 8})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    def test_no_group_id(self, client, mock_get_group_by_id):
        url = '/groups?myD=8'
        response = client.get(url)

        mock_get_group_by_id.assert_not_called()
        assert b'"errorMessage": "Group id missing from request"' in response.data
        assert response.status_code == 400

    def test_success(self, client, mock_get_group_by_id):
        response = client.get(self.url)

        mock_get_group_by_id.assert_called()
        assert b'"group": {"id": 8}' in response.data
        assert response.status_code == 200

class TestGetGroup_NoSuchGroup:
    url = '/groups?id=8'

    def test_no_such_group(self, client, mock_get_group_by_id):
        response = client.get(self.url)

        mock_get_group_by_id.assert_called()
        assert b'"group": null' in response.data
        assert response.status_code == 200

class TestJoinGroup_GroupExists:
    url = '/groups/join'

    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = Group({'id': "efefefefefefefefefefefef", 'eventId': "ffffffffffffffffffffffff", 'members': ["888888888888888888888888", "101010101010101010101010"]})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    @pytest.fixture
    def mock_get_event_by_id(self, mocker):
        event = Event({'period_count': 6})
        return mocker.patch("Repository.get_event_by_id", return_value=event)

    def test_no_group_id(self, client, mock_get_group_by_id, mock_add_user_to_group, mock_get_event_by_id, mock_add_schedule):
        data = {
            'groop': 5,
            'userId': 1,
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_not_called()
        mock_add_user_to_group.assert_not_called()
        mock_get_event_by_id.assert_not_called()
        mock_add_schedule.assert_not_called()
        assert b'"errorMessage": "Group id missing from request"' in response.data
        assert response.status_code == 400

    def test_no_user_id(self, client, mock_get_group_by_id, mock_add_user_to_group, mock_get_event_by_id, mock_add_schedule):
        data = {
            'groupId': "efefefefefefefefefefefef",
            'firstNumber': "aaaaaaaaaaaaaaaaaaaaaaaa",
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_not_called()
        mock_add_user_to_group.assert_not_called()
        mock_get_event_by_id.assert_not_called()
        mock_add_schedule.assert_not_called()
        assert b'"errorMessage": "Joining user id missing from request"' in response.data
        assert response.status_code == 400

    def test_success(self, client, mock_get_group_by_id, mock_add_user_to_group, mock_get_event_by_id, mock_add_schedule):
        data = {
            'groupId': "efefefefefefefefefefefef",
            'userId': "aaaaaaaaaaaabbaaaaaaaaaa",
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_add_user_to_group.assert_called()
        mock_get_event_by_id.assert_called()
        mock_add_schedule.assert_called()
        assert response.status_code == 200

    def test_already_member(self, client, mock_get_group_by_id, mock_add_user_to_group, mock_get_event_by_id, mock_add_schedule):
        data = {
            'groupId': "efefefefefefefefefefefef",
            'userId': "888888888888888888888888",
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_add_user_to_group.assert_not_called()
        mock_get_event_by_id.assert_not_called()
        mock_add_schedule.assert_not_called()
        assert b'"errorMessage": "User is already a member of this group"' in response.data
        assert response.status_code == 400

class TestJoinGroup_NoSuchGroup:
    url = '/groups/join'

    def test_no_such_group(self, client, mock_get_group_by_id, mock_add_user_to_group):
        data = {
            'groupId': 4,
            'userId': 42,
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_add_user_to_group.assert_not_called()
        assert b'"errorMessage": "Requested group could not be found"' in response.data
        assert response.status_code == 400

class TestLeaveGroup_GroupExists:
    url = '/groups/leave'

    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = Group({'id': "156156156156156156156156", 'members': ["adcadcadcadcadcadcadcadc", "151515151515151515151515"]})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    def test_success(self, client, mock_get_group_by_id, mock_remove_user_from_group, mock_remove_schedule_of_user_in_group):
        data = {
            'groupId': "156156156156156156156156",
            'userId': "adcadcadcadcadcadcadcadc",
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_remove_user_from_group.assert_called()
        mock_remove_schedule_of_user_in_group.assert_called()
        assert response.status_code == 200

    def test_no_group_id(self, client, mock_get_group_by_id, mock_remove_user_from_group):
        data = {
            'grouper': 'filet',
            'userId': 3,
        }
        response = client.post(self.url, json=data)
        
        mock_get_group_by_id.assert_not_called()
        mock_remove_user_from_group.assert_not_called()
        assert b'"errorMessage": "Group id missing from request"' in response.data
        assert response.status_code == 400

    def test_no_user_id(self, client, mock_get_group_by_id, mock_remove_user_from_group):
        data = {
            'groupId': "dededededededededededede",
            'vsauce': 'michael here',
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_not_called()
        mock_remove_user_from_group.assert_not_called()
        assert b'"errorMessage": "Leaving user id missing from request"' in response.data
        assert response.status_code == 400

    def test_not_in_group(self, client, mock_get_group_by_id, mock_remove_user_from_group):
        data = {
            'groupId': "234234234234234234234234",
            'userId': "567567567567567567567567",
        }
        response = client.post(self.url, json=data)

        assert b'"errorMessage": "User does not belong to specified group"' in response.data
        assert response.status_code == 400
        mock_get_group_by_id.assert_called()
        mock_remove_user_from_group.assert_not_called()

class TestLeaveGroup_NoSuchGroup:
    url = '/groups/leave'

    def test_no_such_group(self, client, mock_get_group_by_id, mock_remove_user_from_group):
        data = {
            'groupId': 11,
            'userId': 3,
        }
        response = client.post(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_remove_user_from_group.assert_not_called()
        assert b'"errorMessage": "Requested group could not be found"' in response.data
        assert response.status_code == 400

class TestDeleteGroup_GroupExists:
    url = '/groups/nukem'

    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = Group({'owner_id': "898989898989898989898989"})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    def test_no_group_id(self, client, mock_get_group_by_id, mock_remove_group):
        data = {
            'id_of_group': 7,
            'ownerId': "33333333333333333333333",
        }
        response = client.delete(self.url, json=data)

        mock_get_group_by_id.assert_not_called()
        mock_remove_group.assert_not_called()
        assert b'"errorMessage": "Group id is missing from request"' in response.data
        assert response.status_code == 400

    def test_no_owner_id(self, client, mock_get_group_by_id, mock_remove_group):
        data = {
            'groupId': "454545454545454545454545",
            'id_of_owner': 'yes',
        }
        response = client.delete(self.url, json=data)

        mock_get_group_by_id.assert_not_called()
        mock_remove_group.assert_not_called()
        assert b'"errorMessage": "Owner id is missing from request"' in response.data
        assert response.status_code == 400

    def test_user_not_owner(self, client, mock_get_group_by_id, mock_remove_group):
        data = {
            'groupId': "454545454545454545454545",
            'ownerId': "393939393939393939393939",
        }
        response = client.delete(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_remove_group.assert_not_called()
        assert b'"errorMessage": "Given owner is not the owner of the given group"' in response.data
        assert response.status_code == 400

    def test_success(self, client, mock_get_group_by_id, mock_remove_group):
        data = {
            'groupId': "454545454545454545454545",
            'ownerId': "898989898989898989898989",
        }
        response = client.delete(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_remove_group.assert_called()
        assert response.status_code == 200

class TestDeleteGroup_NoSuchGroup:
    url = '/groups/nukem'

    def test_no_group_found(self, client, mock_get_group_by_id, mock_remove_group):
        data = {
            'groupId': "234234234234234234234234",
            'ownerId': "adcadcadcadcadcadcadcadc",
        }
        response = client.delete(self.url, json=data)

        mock_get_group_by_id.assert_called()
        mock_remove_group.assert_not_called()
        assert b'"errorMessage": "Given group could not be found"' in response.data
        assert response.status_code == 400

class TestGetAllGroups:
    url = '/groups/list'

    @pytest.fixture
    def mock_get_all_groups(self, mocker):
        groups = [Group({'event_id': "bebebebebebebebebebebebe", 'owner_id': "123123123123123123123123"}), Group({'event_id': "f6f6f6f6f6f6f6f6f6f6f6f6", 'owner_id': "eeeeeeeeeeeeeeeeeeeeeeee"})]
        return mocker.patch("Repository.get_all_groups", return_value=groups)

    @pytest.fixture
    def mock_get_event_by_id(self, mocker):
        event = Event({'event_name': "3 am"})
        return mocker.patch("Repository.get_event_by_id", side_effect=[event, None])

    @pytest.fixture
    def mock_get_user_by_id(self, mocker):
        user = User({'name': "Steve"})
        return mocker.patch("Repository.get_user_by_id", side_effect=[user, user])

    def test_success(self, client, mock_get_all_groups, mock_get_event_by_id, mock_get_user_by_id):
        response = client.get(self.url)

        mock_get_all_groups.assert_called()
        mock_get_event_by_id.assert_called()
        mock_get_user_by_id.assert_called()
        assert mock_get_event_by_id.call_count == 2
        assert mock_get_user_by_id.call_count == 2
        print(response.data)
        assert b'"groups": [' in response.data
        assert b'{"eventId": "bebebebebebebebebebebebe", "ownerId": "123123123123123123123123", "eventName": "3 am", "ownerName": "Steve"}' in response.data
        assert b'{"eventId": "f6f6f6f6f6f6f6f6f6f6f6f6", "ownerId": "eeeeeeeeeeeeeeeeeeeeeeee", "eventName": "UNKNOWN EVENT", "ownerName": "Steve"}' in response.data
        assert response.status_code == 200

class TestGetUserGroups:
    url = '/groups/mine?userId=23'

    @pytest.fixture
    def mock_get_groups_with_user(self, mocker):
        groups = [Group({'id': '121212121212121212121212'}), Group({'id': '232323232323232323232323'})]
        return mocker.patch("Repository.get_groups_with_user", return_value=groups)

    def test_no_user_id(self, client, mock_get_groups_with_user):
        url = '/groups/mine?disturbed=areyouready'
        response = client.get(url)

        mock_get_groups_with_user.assert_not_called()
        assert b'"errorMessage": "User id missing from request"' in response.data
        assert response.status_code == 400

    def test_success(self, client, mock_get_groups_with_user):
        response = client.get(self.url)

        mock_get_groups_with_user.assert_called()
        assert b'"groups": [{"id": "121212121212121212121212"}, {"id": "232323232323232323232323"}]' in response.data

class TestAddScheduleApproval:
    url = '/groups/approve'

    def test_all_good(self, client, mock_add_approval_for_group):
        data = {
            'groupId': 4,
            'userId': 8
        }
        response = client.post(self.url, json=data)

        mock_add_approval_for_group.assert_called()
        assert response.status_code == 200

    def test_missing_group(self, client, mock_add_approval_for_group):
        data = {
            'userId': 8
        }
        response = client.post(self.url, json=data)

        mock_add_approval_for_group.assert_not_called()
        assert response.status_code == 400
        assert b'"errorMessage": "Group id missing from request"' in response.data

    def test_missing_user(self, client, mock_add_approval_for_group):
        data = {
            'groupId': 8
        }
        response = client.post(self.url, json=data)

        mock_add_approval_for_group.assert_not_called()
        assert response.status_code == 400
        assert b'"errorMessage": "User id missing from request"' in response.data

class TestClearApprovals:
    url = '/groups/approvals'

    def test_all_good(self, client, mock_remove_approvals_for_group):
        data = {
            'groupId': 7
        }
        response = client.delete(self.url, json=data)

        mock_remove_approvals_for_group.assert_called()
        assert response.status_code == 200

    def test_missing_group(self, client, mock_remove_approvals_for_group):
        data = {
            'gorupId': 7
        }
        response = client.delete(self.url, json=data)

        mock_remove_approvals_for_group.assert_not_called()
        assert response.status_code == 400
        assert b'"errorMessage": "Group id missing from request"' in response.data

class TestAddGroupRating:
    url = '/groups/rated'

    def test_all_good(self, client, mock_add_rated_for_group):
        data = {
            'groupId': 7,
            'userId': 8
        }
        response = client.post(self.url, json=data)

        mock_add_rated_for_group.assert_called()
        assert response.status_code == 200

    def test_missing_group(self, client, mock_add_rated_for_group):
        data = {
            'userId': 8
        }
        response = client.post(self.url, json=data)

        mock_add_rated_for_group.assert_not_called()
        assert response.status_code == 400
        assert b'"errorMessage": "Group id missing from request"' in response.data

    def test_missing_user(self, client, mock_add_rated_for_group):
        data = {
            'groupId': 8
        }
        response = client.post(self.url, json=data)

        mock_add_rated_for_group.assert_not_called()
        assert response.status_code == 400
        assert b'"errorMessage": "User id missing from request"' in response.data