import sys
import os
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'db_code'))
from backend.Model import Group
from backend.SomethingCool import create_app
import db_code.Repository as db
import backend.group_service as service
import pytest

class TestCreateGroup_NewGroup(object):

    @pytest.fixture
    def app(self, mocker):
        mocker.patch("Repository.get_group_by_owner",
                     return_value=None)
        mocker.patch("Repository.add_group", return_value=None)
        app = create_app()
        return app

    def test_create_group_success(self, client):
        url = '/createGroup'
        data = {
            'group': {
                'owner': 14,
                'event': 13,
            }
        }

        response = client.post(url, json=data)

        assert response.status_code == 200

    def test_create_group_no_group(self, client):
        url = '/createGroup'
        data = {
            'notgroup': {
                'owner': 11,
                'event': 7,
            }
        }

        response = client.post(url, json=data)

        assert response.json['invalid_key'] == 'Invalid group creation request'
        assert response.status_code == 400

    def test_create_group_no_owner(self, client):
        url = '/createGroup'
        data = {
            'group': {
                'oner': 'me',
                'event': 5,
            }
        }

        response = client.post(url, json=data)

        assert response.json['no_owner'] == 'No owner in group request'
        assert response.status_code == 400

    def test_create_group_no_event(self, client):
        url = '/createGroup'
        data = {
            'group': {
                'owner': 4,
                'evening': '7pm'
            }
        }

        response = client.post(url, json=data)

        assert response.json['no_event'] == 'No event in group request'
        assert response.status_code == 400


class TestCreateGroup_AlreadyExists(object):

    @pytest.fixture
    def app(self, mocker):
        group = Group({'owner': 4, 'event': 3})
        mocker.patch("Repository.get_group_by_owner",
                     return_value=group)
        app = create_app()
        return app

    def test_create_group_already_exists(self, client):
        url = '/createGroup'
        data = {
            'group': {
                'owner': 4,
                'event': 3,
            }
        }

        response = client.post(url, json=data)

        assert response.json['group_exists'] == 'This group has been created already'
        assert response.status_code == 400


def test_get_group():
    pass


def test_join_group():
    pass


def test_leave_group():
    pass


def test_get_all_groups():
    pass


def test_get_user_groups():
    pass
