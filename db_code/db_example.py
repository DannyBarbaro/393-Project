from pymongo import MongoClient

# Client gets the connection to the Mongo instance
client = MongoClient('localhost')
# Define the database that is being used
#   Connects to existing DB or creates the new DB automatically
db = client.seatswap
# Define the specific collection, equivilant to a SQL table
#   Connects to existing collection or automatically creates a new one
collection = db.users

# Document operation examples (equivalent to rows and queries)
#   Basic CRUD operations
# CREATE
collection.insert_one({
  'id' : 1234,
  'name' : "Danny"
})

# READ
result = collection.find_one({'name': "Danny"})
print(result)

# UPDATE
result = collection.update_one({'name' : "Danny" }, {'$set': {'likes': "Bengals"}})
result = collection.find_one({'name': "Danny"})
print(result)

# DELETE
collection.delete_many({'id': 1234})