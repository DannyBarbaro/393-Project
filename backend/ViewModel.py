import json
from bson import ObjectId

def jsonify(view):
    return json.dumps(view, cls=ViewEncoder)

class ViewEncoder(json.JSONEncoder):
    def default(self, view):
        if hasattr(view, "__dict__"):
            return view.__dict__
        elif isinstance(view, ObjectId):
            return str(view)
        else:
            return dict(view)

class EventView:

    def __init__(self, source_obj):
        if source_obj:
            if hasattr(source_obj, "__dict__"):
                source_obj = source_obj.__dict__

            if '_id' in source_obj:
                self.id = source_obj['_id']
            if 'id' in source_obj:
                self.id = source_obj['id']
            if 'time' in source_obj:
                self.startTime = source_obj['time']
            if 'start_time' in source_obj:
                self.startTime = source_obj['start_time']
            if 'startTime' in source_obj:
                self.startTime = source_obj['startTime']
            if 'team1' in source_obj and 'team2' in source_obj:
                self.participants = [source_obj['team1'], source_obj['team2']]
            if 'location' in source_obj:
                self.location = source_obj['location']
            if 'event_type' in source_obj:
                self.eventType = source_obj['event_type']
            if 'eventType' in source_obj:
                self.eventType = source_obj['eventType']
            if 'seats' in source_obj:
                self.seats = source_obj['seats']
            if 'period_count' in source_obj:
                self.periodCount = source_obj['period_count']
            if 'periodCount' in source_obj:
                self.periodCount = source_obj['periodCount']
            if 'event_name' in source_obj:
                self.eventName = source_obj['event_name']
            if 'eventName' in source_obj:
                self.eventName = source_obj['eventName']

class GroupView:

    def __init__(self, source_obj):
        if source_obj:
            if hasattr(source_obj, "__dict__"):
                source_obj = source_obj.__dict__

            if '_id' in source_obj:
                self.id = source_obj['_id']
            if 'id' in source_obj:
                self.id = source_obj['id']
            if 'name' in source_obj:
                self.name = source_obj['name']
            if 'group_size' in source_obj:
                self.group_size = source_obj['group_size']
            if 'groupSize' in source_obj:
                self.group_size = source_obj['groupSize']
            if 'members' in source_obj:
                self.members = source_obj['members']
            if 'event_id' in source_obj:
                self.eventId = source_obj['event_id']
            if 'eventId' in source_obj:
                self.eventId = source_obj['eventId']
            if 'visibility' in source_obj:
                self.visibility = source_obj['visibility']
            if 'owner_id' in source_obj:
                self.ownerId = source_obj['owner_id']
            if 'ownerId' in source_obj:
                self.ownerId = source_obj['ownerId']
            if 'seats' in source_obj:
                self.seats = source_obj['seats']
            if 'approvals' in source_obj:
                self.approvals = source_obj['approvals']
            if 'rated' in source_obj:
                self.rated = source_obj['rated']

class UserScheduleView:

    def __init__(self, source_obj):
        if source_obj:
            if hasattr(source_obj, "__dict__"):
                source_obj = source_obj.__dict__

            if '_id' in source_obj:
                self.id = source_obj['_id']
            if 'id' in source_obj:
                self.id = source_obj['id']
            if 'time_blocks' in source_obj:
                self.timeBlocks = source_obj['time_blocks']
            if 'timeBlocks' in source_obj:
                self.timeBlocks = source_obj['timeBlocks']
            if 'owner' in source_obj:
                self.owner = source_obj['owner']
            if 'group_num' in source_obj:
                self.groupNum = source_obj['group_num']
            if 'groupNum' in source_obj:
                self.groupNum = source_obj['groupNum']

class UserView:

    def __init__(self, source_obj):
        if source_obj:
            if hasattr(source_obj, "__dict__"):
                source_obj = source_obj.__dict__

            if '_id' in source_obj:
                self.id = source_obj['_id']
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
            if 'bio' in source_obj:
                self.bio = source_obj['bio']
            if 'active_groups' in source_obj:
                self.activeGroups = source_obj['active_groups']
            if 'activeGroups' in source_obj:
                self.activeGroups = source_obj['activeGroups']
            if 'card_num' in source_obj:
                self.cardNum = source_obj['card_num']
            if 'cardNum' in source_obj:
                self.cardNum = source_obj['cardNum']
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
            if 'profile_pic' in source_obj:
                self.profilePic = source_obj['profile_pic']
            if 'profilePic' in source_obj:
                self.profilePic = source_obj['profilePic']