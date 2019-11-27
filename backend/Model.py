class Block:

    def __init__(self, source_obj):
        if 'time' in source_obj:
            self.time = source_obj['time']
        if 'seat' in source_obj:
            self.seat = source_obj['seat']

class Event:

    def __init__(self, source_obj):
        if '_id' in source_obj:
            self._id = source_obj['_id']
        if 'id' in source_obj:
            self._id = source_obj['id']
        if 'time' in source_obj:
            self.start_time = source_obj['time']
        if 'team1' in source_obj and 'team2' in source_obj:
            self.participants = [source_obj['team1'], source_obj['team2']]
        if 'location' in source_obj:
            self.location = source_obj['location']
        if 'event_type' in source_obj:
            self.event_type = source_obj['event_type']
        if 'eventType' in source_obj:
            self.event_type = source_obj['eventType']

class GroupSchedule:

    def __init__(self, source_obj):
        if '_id' in source_obj:
            self._id = source_obj['id']
        if 'id' in source_obj:
            self._id = source_obj['id']
        if 'user_schedules' in source_obj:
            self.user_schedules = source_obj['user_schedules']
        if 'userSchedules' in source_obj:
            self.user_schedules = source_obj['userSchedules']
        if 'group_num' in source_obj:
            self.group_num = source_obj['group_num']
        if 'groupNum' in source_obj:
            self.group_num = source_obj['groupNum']

class Group:

    def __init__(self, source_obj):
        if '_id' in source_obj:
            self._id = source_obj['_id']
        if 'id' in source_obj:
            self._id = source_obj['id']
        if 'name' in source_obj:
            self.name = source_obj['name']
        if 'members' in source_obj:
            self.members = source_obj['members']
        if 'event_id' in source_obj:
            self.event_id = source_obj['event_id']
        if 'eventId' in source_obj:
            self.event_id = source_obj['eventId']
        if 'visibility' in source_obj:
            self.visibility = source_obj['visibility']
        if 'owner_id' in source_obj:
            self.owner_id = source_obj['owner_id']
        if 'ownerId' in source_obj:
            self.owner_id = source_obj['ownerId']

class UserSchedule:

    def __init__(self, source_obj):
        if '_id' in source_obj:
            self._id = source_obj['_id']
        if 'id' in source_obj:
            self._id = source_obj['id']
        if 'time_blocks' in source_obj:
            self.time_blocks = source_obj['time_blocks']
        if 'timeBlocks' in source_obj:
            self.time_blocks = source_obj['timeBlocks']
        if 'owner' in source_obj:
            self.owner = source_obj['owner']

class User:

    def __init__(self, source_obj):
        if '_id' in source_obj:
            self._id = source_obj['_id']
        if 'id' in source_obj:
            self._id = source_obj['id']
        if 'email' in source_obj:
            self.email = source_obj['email']
        if 'rating_history' in source_obj:
            self.rating_history = source_obj['rating_history']
        if 'ratingHistory' in source_obj:
            self.rating_history = source_obj['ratingHistory']
        if 'favorite_teams' in source_obj:
            self.favorite_teams = source_obj['favorite_teams']
        if 'favoriteTeams' in source_obj:
            self.favorite_teams = source_obj['favoriteTeams']
        if 'group_history' in source_obj:
            self.group_history = source_obj['group_history']
        if 'groupHistory' in source_obj:
            self.group_history = source_obj['groupHistory']
        if 'name' in source_obj:
            self.name = source_obj['name']
        if 'bio' in source_obj:
            self.bio = source_obj['bio']
        if 'active_groups' in source_obj:
            self.active_groups = source_obj['active_groups']
        if 'activeGroups' in source_obj:
            self.active_groups = source_obj['activeGroups']
        if 'card_num' in source_obj:
            self.card_num = source_obj['card_num']
        if 'cardNum' in source_obj:
            self.card_num = source_obj['cardNum']
        if 'card_security' in source_obj:
            self.cardSecurity = source_obj['card_security']
        if 'cardSecurity' in source_obj:
            self.cardSecurity = source_obj['cardSecurity']
        if 'card_name' in source_obj:
            self.cardName = source_obj['card_name']
        if 'cardName' in source_obj:
            self.cardName = source_obj['cardName']
        if 'billing_address_1' in source_obj:
            self.billingAddress1 = source_obj['billing_address_1']
        if 'billingAddress1' in source_obj:
            self.billingAddress1 = source_obj['billingAddress1']
        if 'billing_address_2' in source_obj:
            self.billingAddress2 = source_obj['billing_address_2']
        if 'billingAddress2' in source_obj:
            self.billingAddress2 = source_obj['billingAddress2']
        if 'billing_city' in source_obj:
            self.billingCity = source_obj['billing_city']
        if 'billingCity' in source_obj:
            self.billingCity = source_obj['billingCity']
        if 'billing_state' in source_obj:
            self.billingState = source_obj['billing_state']
        if 'billingState' in source_obj:
            self.billingState = source_obj['billingState']
        if 'billing_zip' in source_obj:
            self.billingZip = source_obj['billing_zip']
        if 'billingZip' in source_obj:
            self.billingZip = source_obj['billingZip']