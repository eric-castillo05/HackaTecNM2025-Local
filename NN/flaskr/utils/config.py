import os

from dotenv import load_dotenv

load_dotenv()

class Config:
    ROUTE=os.getenv("ROUTE")
    REPO_ID=os.getenv("REPO_ID")
    model_path=os.getenv("MODEL_NAME")
    preprocessor_path=os.getenv("PREPROCESSOR_NAME")
    label_encoder_path=os.getenv("LABEL_ENCODER")
    ROUTE_FLASKR=os.getenv("ROUTE_FLASKR")
