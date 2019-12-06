import sys
import os
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))
import pytest
from backend.backend import create_app
from backend.Model import Event

@pytest.fixture
def app():
    return create_app()

@pytest.fixture
def mock_get_all_future_events(mocker):
    return mocker.patch("Repository.get_all_future_events", return_value=None)

class TestGetFutureEvents:
    url = '/futureEvents'

    @pytest.fixture
    def mock_get_all_future_events(self, mocker):
        event1 = Event({'event_name': "today"})
        event2 = Event({'event_name': "tomorrow"})
        return mocker.patch("Repository.get_all_future_events", return_value=[event1, event2])

    def test_success(self, client, mock_get_all_future_events):
        response = client.get(self.url)

        mock_get_all_future_events.assert_called()
        assert b'"events": [{"event_name": "today"}, {"event_name": "tomorrow"}]' in response.data
        assert response.status_code == 200