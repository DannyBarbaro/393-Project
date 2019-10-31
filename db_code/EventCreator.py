from pymongo import MongoClient

# Client gets the connection to the Mongo instance
client = MongoClient('localhost')
db = client.seatswap
events = db.events

name = input("Name: ")
loc = input("Location: ")
dt = input("DateTime: ")
t1 = input("Team1: ")
t2 = input("Team2: ")
typeOf = input("Type: ")
seats = input("Seats: ")
price = input("Prices: ")

events.insert_one({
  'name' : name,
  'location' : loc,
  'time' : dt,
  'team1' : t1,
  'team1' : t2,
  'type' : typeOf,
  'seats' : seats,
  'price' : price,
})
