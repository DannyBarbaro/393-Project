# SeatSwap
Source code repository for 393 project: SeatSwap

Currently this project contains a Jenkins Build Pipeline and Slack Integration

The data for this project will be stored in the users local MongoDB instance. To use this, MongoDB must first be installed: https://docs.mongodb.com/manual/administration/install-community/

The project is currently supporting MongoDB Community edition 4.2

# Dependencies

Python:
  - pip install pymongo flask flask_api flask_cors

Testing:
  - pip install pytest pytest-flask pytest-mock pytest-cov

  To run tests from root dir: python3 -m pytest unit_tests/
  To run tests with coverage measures: python3 -m pytest --cov-report term-missing --cov=backend unit_tests

Frontend:
  - React.js
  - React router
  - honestly just do npm install
  - npm install react-google-login
  - npm install @material-ui/core
  - npm install @material-ui/icons