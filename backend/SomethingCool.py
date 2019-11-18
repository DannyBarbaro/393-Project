import configparser
from flask import Flask
from flask_cors import CORS
import profile_service as profile
import group_service as groups
# import blueprint files
# ex: from Blueprint import test_api

# Read configuration from file.
config = configparser.ConfigParser()
config.read('config.ini')

# Set up application serverGET.
def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(profile.profile)
    app.register_blueprint(groups.group)

    return app


app = create_app()

if __name__ == '__main__':
    app.run(**config['app'])
