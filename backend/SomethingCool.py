import configparser
from flask import Flask
from flask_cors import CORS
# import blueprint files
# ex: from Blueprint import test_api

# Read configuration from file.
config = configparser.ConfigParser()
config.read('config.ini')

# Set up application server.
app = Flask(__name__)
CORS(app)

# register all blue prints
# ex: app.register_blueprint(test_api)

if __name__ == '__main__':
    app.run(**config['app'])