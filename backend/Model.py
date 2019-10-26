class Block(object):

    def __init__(self, time, seat):
        self.time = time
        self.seat = seat

class Event(object):

    def __init__(self, id_num, time, team1, team2, location, event_type):
        self.id = id_num
        self.start_time = time
        self.participants = [team1, team2]
        self.location = location
        self.event_type = event_type

class GroupSchedule(object):

    def __init__(self, id_num, group_no):
        self.id = id_num
        self.user_schedules = []
        self.group_no = group_no

class Group(object):

    def __init__(self, id_no, name, members, event, visibility):
        self.id_no = id_no
        self.name = name
        self.members = members
        self.event = event
        self.visibility = visibility

class UserSchedule(object):

    def __init__(self, id_no, time_blocks, owning_user):
        self.id_no = id_no
        self.time_blocks = time_blocks
        self.owning_user = owning_user

class User(object):

    def __init__(self, id_no, email_addr, favorite_teams, name):
        self.id_no = id_no
        self.email_addr = email_addr
        self.rating_history = []
        self.favorite_teams = favorite_teams
        self.group_history = []
        self.name = name
        self.active_groups = []
