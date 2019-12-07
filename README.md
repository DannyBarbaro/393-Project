# SeatSwap
Source code repository for 393 project: SeatSwap

This file contains instructions for installing, running, and using SeatSwap.

# Setup and Installation

## MongoDB

The data for this project will be stored in the users local MongoDB instance. To use this, MongoDB must first be installed: https://docs.mongodb.com/manual/administration/install-community/

The project is currently supporting MongoDB Community edition 4.2

If you wish to change the address of the Mongo instance, the file ```Repository.py``` must be updated to connect to this instance instead of localhost.

Note that the ```mongod``` service must be running in order for connections to mongo to work. This service tends to shut down when your computer shuts down, and must be manually restarted.

## Python

The backend server is run on Python 3: https://wiki.python.org/moin/BeginnersGuide/Download

There are a number of libraries that can be installed from a command line with pip:
```pip install pymongo flask flask_api flask_cors pytest pytest-flask pytest-mock pytest-cov```

## React

The frontend build uses React. To install react, you must first install Node: https://nodejs.org/en/

From here, all dependencies should be installable by navigating to the ```frontend``` folder and running ```npm install```. For the sake of completeness, all dependencies we have installed are listed below:
  - npm install react
  - npm install react-router-dom
  - npm install react-google-login
  - npm install react-cookie
  - npm install @material-ui/core
  - npm install @material-ui/icons
  - npm install @material-ui/lab

# Running SeatSwap

## Frontend server

To start a localhost server running the frontend, navigate to the ```frontend``` folder and run ```npm start```. If a browser window does not open automatically after the server is started, you can manually navigate to the address given in your console and view the page.

## Backend server

To start the backend server, navigate to the ```backend``` folder and run ```python backend.py```. Note that if you have multiple python installations you may need to specify ```python3```.

If you wish, the host address and port number can be changed in ```backend/config.ini```. If you choose to do this, you must also change the API base URL in ```frontend/App.js```.

## Unit tests

To run the units tests from root directory, run ```python3 -m pytest --cov-report term-missing --cov=backend unit_tests```. This will produce a coverage report of all the backend code.

# Using SeatSwap

## Managing Events

In order for the app to function properly, there must be some events in the database. Because events would typically come from a third party, there is no way for a user to create their own event. In order to populate your local database with some events, navigate to the ```db_code``` folder and run ```python EventCreator.py```. This script may be modied and run to create events other than what we have provided.

In addition, some functionality in the app is based on the time events occurred. For convenience, we suggest creating events far in the future so that there is no danger of their start time passing while you are looking at the page. We have provided a script that will change the time of an event to the current time so that you may see what the page looks like afterwards. To run this script, you must have the ID of the event, as output by ```EventCreator.py```. Next, update the script ```db_code/warp_time.py``` to contain this ID, and run the script from the command line.

## Account creation and Login

Account management is done with Google login. The only way to login to SeatSwap is with a Google account. The first time you login, you are prompted to enter your profile information and your account is automatically created for you. The information can be edited later from the Profile page.

## Creating groups

To create a group, navigate to the Groups page from the menu in the top left. Here there will be a button to create a new group. Keep in mind each user may only be a member of one group per event.

## Searching for groups

To search for groups other users have created for given events, navigate to the Search page from the menu in the top left. This page shows all public groups for future events that you are able to join. Keep in mind each user may only be a member of one group per event. You can directly join any group on this page.

## Private groups

Private groups are not listed on the search page. The only way to join a private group is to have the group's URL, and join from the group page. Once you join a private group, that group is listed on the My Groups page along with all other groups you are currently a member of.

## Managing groups

The My Groups page allows you to see all groups you are currently a member of. From this page you may leave any group. Clicking on the group's name will open a window where you can see information about the group. Here you may edit your schedule for the group, and if the group's schedule is full then you may vote to approve the schedule.

If you are the owner of any groups, they will also appear on this page. If you are the owner you may disband a group instead of leaving it. You may also kick group members by clicking the button below their names.

## Rating team members

Once an event ends, you may return the page for that group to rate your groupmates. A user's rating score is shown to other users if it is low to warn them that this user is uncooperative.