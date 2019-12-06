import sys
import os
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))
import pytest
from backend.backend import create_app
from backend.Model import Group, UserSchedule
from backend.ViewModel import UserScheduleView

@pytest.fixture
def app():
    return create_app()

@pytest.fixture
def mock_get_group_by_id(mocker):
    return mocker.patch("Repository.get_group_by_id", return_value=None)

@pytest.fixture
def mock_get_schedules_for_group(mocker):
    return mocker.patch("Repository.get_schedules_for_group", return_value=None)

@pytest.fixture
def mock_get_schedule_of_user_in_group(mocker):
    return mocker.patch("Repository.get_schedule_of_user_in_group", return_value=None)

@pytest.fixture
def mock_update_schedule_of_user_in_group(mocker):
    return mocker.patch("Repository.update_schedule_of_user_in_group", return_value=None)

class TestGetSchedulesForGroup_GroupExists:
    url = '/groupSchedules?groupId=345634563456345634563456'

    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = Group({'_id': "234523452345234523452345"})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    @pytest.fixture
    def mock_get_schedules_for_group(self, mocker):
        sched1 = UserSchedule({'id': "345345345345345345345345"})
        sched2 = UserSchedule({'id': "adcadcadcadcadcadcadcadc"})
        return mocker.patch("Repository.get_schedules_for_group", return_value=[sched1, sched2])

    def test_no_group_id(self, client, mock_get_group_by_id, mock_get_schedules_for_group):
        url = '/groupSchedules'
        response = client.get(url)

        mock_get_group_by_id.assert_not_called()
        mock_get_schedules_for_group.assert_not_called()
        assert b'"errorMessage": "Group id missing from request"' in response.data
        assert response.status_code == 400

    def test_success(self, client, mock_get_group_by_id, mock_get_schedules_for_group):
        response = client.get(self.url)

        mock_get_group_by_id.assert_called()
        mock_get_schedules_for_group.assert_called()
        assert b'"schedules": [{"id": "345345345345345345345345"}, {"id": "adcadcadcadcadcadcadcadc"}]' in response.data
        assert response.status_code == 200

class TestGetSchedulesForGroup_NoSuchGroup:
    url = '/groupSchedules?groupId=345634563456345634563456'

    def test_no_group_found(self, client, mock_get_group_by_id, mock_get_schedules_for_group):
        response = client.get(self.url)

        mock_get_group_by_id.assert_called()
        mock_get_schedules_for_group.assert_not_called()
        assert b'"errorMessage": "Requested group could not be found"' in response.data
        assert response.status_code == 400

class TestGetOpenSeatsForGroup_GroupExists:
    url = '/openSeats?groupId=678967896789678967896789&userId=adadadadadadadadadadadad'

    @pytest.fixture
    def mock_get_group_by_id(self, mocker):
        group = Group({'id': "345345345345345345345345", 'seats': ["1", "2", "3"]})
        return mocker.patch("Repository.get_group_by_id", return_value=group)

    @pytest.fixture
    def mock_get_schedules_for_group(self, mocker):
        sched1 = UserSchedule(
            {'id': "345345345345345345345345", 'time_blocks': ['1', '1', '2', '3']})
        sched2 = UserSchedule(
            {'id': "adcadcadcadcadcadcadcadc", 'time_blocks': [None, None, None, None]})
        return mocker.patch("Repository.get_schedules_for_group", return_value=[sched1, sched2])

    @pytest.fixture
    def mock_get_schedule_of_user_in_group(self, mocker):
        sched = UserSchedule({'time_blocks': [None, None, None, None]})
        return mocker.patch("Repository.get_schedule_of_user_in_group", return_value=sched)

    def test_no_group_id(self, client, mock_get_group_by_id, mock_get_schedules_for_group, mock_get_schedule_of_user_in_group):
        url = '/openSeats?userId=adadadadadadadadadadadad'
        response = client.get(url)

        mock_get_group_by_id.assert_not_called()
        mock_get_schedules_for_group.assert_not_called()
        mock_get_schedule_of_user_in_group.assert_not_called()
        assert b'"errorMessage": "Group id missing from request"' in response.data
        assert response.status_code == 400

    def test_no_user_id(self, client, mock_get_group_by_id, mock_get_schedules_for_group, mock_get_schedule_of_user_in_group):
        url = '/openSeats?groupId=adadadadadadadadadadadad'
        response = client.get(url)

        mock_get_group_by_id.assert_not_called()
        mock_get_schedules_for_group.assert_not_called()
        mock_get_schedule_of_user_in_group.assert_not_called()
        assert b'"errorMessage": "User id missing from request"' in response.data
        assert response.status_code == 400

    def test_success(self, client, mock_get_group_by_id, mock_get_schedules_for_group, mock_get_schedule_of_user_in_group):
        response = client.get(self.url)

        mock_get_group_by_id.assert_called()
        mock_get_schedules_for_group.assert_called()
        mock_get_schedule_of_user_in_group.assert_called()
        assert b'"openSeats": [["", null, "2", "3"], ["", null, "2", "3"], ["", null, "1", "3"], ["", null, "1", "2"]]' in response.data
        assert response.status_code == 200

class TestGetOpenSeatsForGroup_NoSuchGroup:
    url = '/openSeats?groupId=678967896789678967896789&userId=adadadadadadadadadadadad'

    def test_no_group_found(self, client, mock_get_group_by_id, mock_get_schedules_for_group):
        response = client.get(self.url)

        mock_get_group_by_id.assert_called()
        mock_get_schedules_for_group.assert_not_called()
        assert b'"errorMessage": "Requested group could not be found"' in response.data
        assert response.status_code == 400

class TestUpdateSchedule_ScheduleExists:
    url = '/updateSchedule'

    @pytest.fixture
    def mock_get_schedule_of_user_in_group(self, mocker):
        sched = UserSchedule({})
        return mocker.patch("Repository.get_schedule_of_user_in_group", return_value=sched)

    def test_no_group_id(self, client, mock_get_schedule_of_user_in_group, mock_update_schedule_of_user_in_group):
        data = {
            'userId': "efefefefefefefefefefefef",
            'seats': ['1', '2', None, None],
        }
        response = client.post(self.url, json=data)

        mock_get_schedule_of_user_in_group.assert_not_called()
        mock_update_schedule_of_user_in_group.assert_not_called()
        assert b'"errorMessage": "Group id missing from request"' in response.data
        assert response.status_code == 400

    def test_no_user_id(self, client, mock_get_schedule_of_user_in_group, mock_update_schedule_of_user_in_group):
        data = {
            'groupId': "678678678678678678678678",
            'seats': ['1', '2', None, None],
        }
        response = client.post(self.url, json=data)

        mock_get_schedule_of_user_in_group.assert_not_called()
        mock_update_schedule_of_user_in_group.assert_not_called()
        assert b'"errorMessage": "User id missing from request"' in response.data
        assert response.status_code == 400

    def test_no_seats(self, client, mock_get_schedule_of_user_in_group, mock_update_schedule_of_user_in_group):
        data = {
            'groupId': "678678678678678678678678",
            'userId': "efefefefefefefefefefefef",
        }
        response = client.post(self.url, json=data)

        mock_get_schedule_of_user_in_group.assert_not_called()
        mock_update_schedule_of_user_in_group.assert_not_called()
        assert b'"errorMessage": "Schedule data missing from request"' in response.data
        assert response.status_code == 400

    def test_success(self, client, mock_get_schedule_of_user_in_group, mock_update_schedule_of_user_in_group):
        data = {
            'groupId': "678678678678678678678678",
            'userId': "efefefefefefefefefefefef",
            'seats': ['1', '2', None, None],
        }
        response = client.post(self.url, json=data)

        mock_get_schedule_of_user_in_group.assert_called()
        mock_update_schedule_of_user_in_group.assert_called()
        assert response.status_code == 200

class TestUpdateSchedule_NoSuchSchedule:
    url = '/updateSchedule'

    def test_no_schedule_found(self, client, mock_get_schedule_of_user_in_group, mock_update_schedule_of_user_in_group):
        data = {
            'groupId': "678678678678678678678678",
            'userId': "efefefefefefefefefefefef",
            'seats': ['1', '2', None, None],
        }
        response = client.post(self.url, json=data)

        mock_get_schedule_of_user_in_group.assert_called()
        mock_update_schedule_of_user_in_group.assert_not_called()
        assert b'"errorMessage": "No schedule found for given user in given group"' in response.data
        assert response.status_code == 400
