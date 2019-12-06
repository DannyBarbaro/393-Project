import os, sys
sys.path.append(os.path.join(os.path.dirname(sys.path[0]), 'backend'))
import Model
import Repository as repo
from bson.objectid import ObjectId

def add_seats_to_group(group_id):
    group = repo.get_group_by_id(group_id)

    seats = [f"seat{i}" for i in range(4)]
    repo.set_group_seats(group_id, seats)

    for member in group.members:
        repo.add_schedule(Model.UserSchedule({'time_blocks': [None for _ in range(4)], 'owner': member, 'group_num': ObjectId(group_id)}))


add_seats_to_group("5de75f5479cf153e2e2d691d")