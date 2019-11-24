from pymongo import MongoClient
from datetime import datetime

# Client gets the connection to the Mongo instance
client = MongoClient('localhost')
db = client.seatswap
events = db.events

name = input("Name: ")
loc = input("Location: ")
year = int(input("Year: "))
month = int(input("Month: "))
day = int(input("Day: "))
hour = int(input("Hour: "))
minute = int(input("Minute: "))
second = int(input("Second: "))
dt = datetime(year, month, day, hour, minute, second)
t1 = input("Team1: ")
t2 = input("Team2: ")
typeOf = input("Type: ")
seats = input("Seats: ").split(',')
price = [float(x) for x in input("Prices: ").split(',')]

events.insert_one({
  'name' : name,
  'location' : loc,
  'time' : dt,
  'team1' : t1,
  'team2' : t2,
  'type' : typeOf,
  'seats' : seats,
  'price' : price,
})
