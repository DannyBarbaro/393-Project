from pymongo import MongoClient

# Client gets the connection to the Mongo instance
client = MongoClient('localhost')
db = client.seatswap

# delete all collections
cols = db.collection_names()
for col in cols :
  db.drop_collection(col)

# create fake users

# create events

# create groups

# create schedules