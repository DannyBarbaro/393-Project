import json

class ViewEncoder(json.JSONEncoder):
    def default(self, view):
        return view.__dict__

class BlockView:

    def __init__(self, source_obj):
        if not isinstance(source_obj, dict):
            source_obj = source_obj.__dict__

        if 'time' in source_obj:
            self.time = source_obj['time']
        if 'seat' in source_obj:
            self.seat = source_obj['seat']

    def _json(self):
        return self.__dict__()

class EventView:

    def __init__(self, source_obj):
        if not isinstance(source_obj, dict):
            source_obj = source_obj.__dict__

        if 'id' in source_obj:
            self.id = source_obj['id']
        if 'time' in source_obj:
            self.start_time = source_obj['time']
        if 'team1' in source_obj and 'team2' in source_obj:
            self.participants = [source_obj['team1'], source_obj['team2']]
        if 'location' in source_obj:
            self.location = source_obj['location']
        if 'event_type' in source_obj:
            self.eventType = source_obj['event_type']
        if 'eventType' in source_obj:
            self.eventType = source_obj['eventType']

class GroupScheduleView:

    def __init__(self, source_obj):
        if not isinstance(source_obj, dict):
            source_obj = source_obj.__dict__

        if 'id' in source_obj:
            self.id = source_obj['id_num']
        if 'user_schedules' in source_obj:
            self.userSchedules = source_obj['user_schedules']
        if 'userSchedules' in source_obj:
            self.userSchedules = source_obj['userSchedules']
        if 'group_num' in source_obj:
            self.groupNum = source_obj['group_num']
        if 'groupNum' in source_obj:
            self.groupNum = source_obj['groupNum']

class GroupView:

    def __init__(self, source_obj):
        if not isinstance(source_obj, dict):
            source_obj = source_obj.__dict__

        if 'id' in source_obj:
            self.id = source_obj['id']
        if 'name' in source_obj:
            self.name = source_obj['name']
        if 'members' in source_obj:
            self.members = source_obj['members']
        if 'event' in source_obj:
            self.event = source_obj['event']
        if 'visibility' in source_obj:
            self.visibility = source_obj['visibility']
        if 'owner' in source_obj:
            self.owner = source_obj['owner']

class UserScheduleView:

    def __init__(self, source_obj):
        if not isinstance(source_obj, dict):
            source_obj = source_obj.__dict__

        if 'id' in source_obj:
            self.id = source_obj['id']
        if 'time_blocks' in source_obj:
            self.timeBlocks = source_obj['time_blocks']
        if 'timeBlocks' in source_obj:
            self.timeBlocks = source_obj['timeBlocks']
        if 'owner' in source_obj:
            self.owner = source_obj['owner']

class UserView:

    def __init__(self, source_obj):
        if not isinstance(source_obj, dict):
            source_obj = source_obj.__dict__

        if 'id' in source_obj:
            self.id = source_obj['id']
        if 'email' in source_obj:
            self.email = source_obj['email']
        if 'rating_history' in source_obj:
            self.ratingHistory = source_obj['rating_history']
        if 'ratingHistory' in source_obj:
            self.ratingHistory = source_obj['ratingHistory']
        if 'favorite_teams' in source_obj:
            self.favoriteTeams = source_obj['favorite_teams']
        if 'favoriteTeams' in source_obj:
            self.favoriteTeams = source_obj['favoriteTeams']
        if 'group_history' in source_obj:
            self.groupHistory = source_obj['group_history']
        if 'groupHistory' in source_obj:
            self.groupHistory = source_obj['groupHistory']
        if 'name' in source_obj:
            self.name = source_obj['name']
        if 'active_groups' in source_obj:
            self.activeGroups = source_obj['active_groups']
        if 'activeGroups' in source_obj:
            self.activeGroups = source_obj['activeGroups']
        if 'card_num' in source_obj:
            self.cardNum = source_obj['card_num']
        if 'cardNum' in source_obj:
            self.cardNum = source_obj['cardNum']
