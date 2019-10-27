from pymongo import MongoClient
client = MongoClient('localhost')
db = client.seatswap
users = db.users
groups = db.groups

users.drop()
groups.drop()

#Users
josh = {'name': 'Josh', 'email': 'e@mail.com', 'card_num': '1'}
conor = {'name': 'Conor', 'email': 'mail@e.com', 'card_num': '2'}
danny = {'name': 'Danny', 'email': 'ay@lmao', 'card_num': '3'}

users.insert_one(josh)
users.insert_one(danny)
users.insert_one(conor)

groups.insert_one({'name': 'The real OGs', 'owner': josh, 'members': [josh, danny], 'event': 'squirrel chasing'})
groups.insert_one({'name': 'The not as real OGs', 'owner': conor, 'members': [conor, josh], 'event': 'birdfeeding'})
groups.insert_one({'name': 'Honestly who are these guys', 'owner': danny, 'members': [danny, conor], 'event': 'basket weaving'})