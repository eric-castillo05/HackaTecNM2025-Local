from flask import Flask
from flask_cors.extension import CORS
from utils import Config


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": Config.ROUTE}}, supports_credentials=True)
    return app