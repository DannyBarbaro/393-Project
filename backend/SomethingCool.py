import configparser
from flask import Flask
from flask_cors import CORS
from Blueprint import test_api
import profile_service as profile
import group_service as groups
# import blueprint files
# ex: from Blueprint import test_api

# Read configuration from file.
config = configparser.ConfigParser()
config.read('config.ini')

# Set up application serverGET.
app = Flask(__name__)
CORS(app)

# register all blue prints
app.register_blueprint(test_api)
app.register_blueprint(profile.profile)
app.register_blueprint(groups.group)

if __name__ == '__main__':
    app.run(**config['app'])