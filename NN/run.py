from flask import Flask, request, jsonify
import joblib
import pandas as pd
from tensorflow.keras.models import load_model

# Cargar modelos y procesadores
label_encoder = joblib.load('label_encoder.pkl')
preprocessor = joblib.load('preprocessor.pkl')
model = load_model('neural_network_model.keras')

app = Flask(__name__)


@app.route('/')
def home():
    return "API de predicción funcionando correctamente."


@app.route('/predict', methods=['POST'])
def predict():
    try:
        new_data_dict = request.json
        if not new_data_dict:
            return jsonify({'error': 'No data provided'}), 400

        new_df = pd.DataFrame([new_data_dict])
        new_scaled = preprocessor.transform(new_df)

        # Predicción con red neuronal
        pred_nn = (model.predict(new_scaled) > 0.8).astype(int)[0, 0]
        proba_nn = model.predict(new_scaled)[0, 0]

        return jsonify({
            'Red_Neuronal': {
                'Clase': label_encoder.classes_[pred_nn],
                'Probabilidad': round(float(proba_nn), 3)
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
