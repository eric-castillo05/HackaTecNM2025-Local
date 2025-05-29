import joblib
import pandas as pd
from tensorflow.keras.models import load_model


def load_models():
    """Carga todos los modelos guardados"""
    # Cargar label encoder
    label_encoder = joblib.load('label_encoder.pkl')

    # Cargar preprocessor
    preprocessor = joblib.load('preprocessor.pkl')

    # Cargar red neuronal
    model = load_model('neural_network_model.keras')
    # O si usaste SavedModel: model = load_model('neural_network_model')

    return label_encoder, preprocessor, model


def predict_new_case(new_data_dict, label_encoder=None, preprocessor=None, model=None):
    """
    Función para predecir nuevos casos usando modelos cargados

    Parameters:
    -----------
    new_data_dict : dict
        Diccionario con los datos del nuevo caso
    label_encoder, preprocessor, log_reg, model :
        Modelos cargados. Si son None, se cargan automáticamente
    """

    # Si no se proporcionan los modelos, cargarlos
    if any(x is None for x in [label_encoder, preprocessor, model]):
        print("Cargando modelos...")
        label_encoder, preprocessor, model = load_models()

    # Convertir a DataFrame
    new_df = pd.DataFrame([new_data_dict])

    # Preprocesar datos
    new_scaled = preprocessor.transform(new_df)

    # Predicción con red neuronal
    pred_nn = (model.predict(new_scaled) > 0.8).astype(int)[0, 0]
    proba_nn = model.predict(new_scaled)[0, 0]

    print(f"Red Neuronal: {label_encoder.classes_[pred_nn]} (Probabilidad: {proba_nn:.3f})")

    return {
        'neural_net': {'prediction': label_encoder.classes_[pred_nn], 'probability': proba_nn}
    }


if __name__ == "__main__":
    label_encoder, preprocessor, model = load_models()
    nuevo_caso = {
        'Edad': 30,
        'Gender': 'Femenino',
        'Antecedentes_Text': 'Abuso Sexual',
        'Estado_Civil': 'Casado',
        'Ya_Ha_Adoptado': 'No',
        'Hijos_Biologicos': 1,
        'Ultimo_Grado_Estudios': 'Universidad',
        'Ingreso_Mensual': 25000,
        'Years_Actual_Work': 5,
        'Tipo_Casa': 'Propia',
        'Ciudad': 'Guadalajara',
        'Estado': 'Jalisco',
        'Psychometric_Score': 40,
        'Historial_Psiquiatrico': 'No',
        'Domestic_Violence_Text': 'Sin reportes'
    }

    print(predict_new_case(nuevo_caso, label_encoder, preprocessor))