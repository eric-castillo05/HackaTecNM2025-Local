from flask import Flask
from flask_cors.extension import CORS
from flaskr import routes
from flaskr.routes.predict import model_bp
from flaskr.utils import Config

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": Config.ROUTE}}, supports_credentials=True)
    app.register_blueprint(model_bp, url_prefix='adoptrix')
    return app