class Block(object):

    def __init__(self, db_obj):
        if 'time' in db_obj:
            self.time = db_obj['time']
        if 'seat' in db_obj:
            self.seat = db_obj['seat']

class Event(object):

    def __init__(self, db_obj):
        if 'id' in db_obj:
            self.id = db_obj['id']
        if 'time' in db_obj:
            self.start_time = db_obj['time']
        if 'team1' in db_obj and 'team2' in db_obj:
            self.participants = [db_obj['team1'], db_obj['team2']]
        if 'location' in db_obj:
            self.location = db_obj['location']
        if 'event_type' in db_obj:
            self.event_type = db_obj['event_type']

class GroupSchedule(object):

    def __init__(self, db_obj):
        if 'id' in db_obj:
            self.id = db_obj['id_num']
        if 'user_schedules' in db_obj:
            self.user_schedules = db_obj['user_schedules']
        if 'group_num' in db_obj:
            self.group_num = db_obj['group_num']

class Group(object):

    def __init__(self, db_obj):
        if 'id' in db_obj:
            self.id = db_obj['id']
        if 'name' in db_obj:
            self.name = db_obj['name']
        if 'members' in db_obj:
            self.members = db_obj['members']
        if 'event' in db_obj:
            self.event = db_obj['event']
        if 'visibility' in db_obj:
            self.visibility = db_obj['visibility']
        if 'owner' in db_obj:
            self.owner = db_obj['owner']

class UserSchedule(object):

    def __init__(self, db_obj):
        if 'id' in db_obj:
            self.id = db_obj['id']
        if 'time_blocks' in db_obj:
            self.time_blocks = db_obj['time_blocks']
        if 'owner' in db_obj:
            self.owner = db_obj['owner']

class User(object):

    def __init__(self, db_obj):
        if 'id' in db_obj:
            self.id = db_obj['id']
        if 'email' in db_obj:
            self.email = db_obj['email']
        if 'rating_history' in db_obj:
            self.rating_history = db_obj['rating_history']
        if 'favorite_teams' in db_obj:
            self.favorite_teams = db_obj['favorite_teams']
        if 'group_history' in db_obj:
            self.group_history = db_obj['group_history']
        if 'name' in db_obj:
            self.name = db_obj['name']
        if 'active_groups' in db_obj:
            self.active_groups = db_obj['active_groups']
        if 'card_num' in db_obj:
            self.active_groups = db_obj['card_num']
