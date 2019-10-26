from flask import Blueprint, jsonify

test_api = Blueprint('test_api', __name__)

@test_api.route("/test")
def testing():
    return jsonify({"thing": "YEET"})