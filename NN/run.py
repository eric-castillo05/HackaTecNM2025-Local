from huggingface_hub import hf_hub_download
import tensorflow as tf
import joblib
import pandas as pd

# Repositorio
repo_id = "ericcastillo/adoptrix"

# Descargar archivos
modelo_path = hf_hub_download(repo_id=repo_id, filename="adoptrix.keras")
# preprocessor_path = hf_hub_download(repo_id=repo_id, filename="preprocessor.joblib")
# label_encoder_path = hf_hub_download(repo_id=repo_id, filename="label_encoder.joblib")  # ESTE es el correcto

# Cargar modelos y transformadores
model = tf.keras.models.load_model(modelo_path)
preprocessor = joblib.load('preprocessor.joblib')
label_encoder = joblib.load('label_encoder.joblib')  # Esto tiene .classes_

# Nuevo caso
nuevo_caso = {
    'Edad': 30,
    'Gender': 'Femenino',
    'Antecedentes_Text': 'Sin antecedentes penales',
    'Estado_Civil': 'Casado',
    'Ya_Ha_Adoptado': 'No',
    'Hijos_Biologicos': 1,
    'Ultimo_Grado_Estudios': 'Universidad',
    'Ingreso_Mensual': 25000,
    'Years_Actual_Work': 5,
    'Tipo_Casa': 'Propia',
    'Ciudad': 'Guadalajara',
    'Estado': 'Jalisco',
    'Psychometric_Score': 90,
    'Historial_Psiquiatrico': 'No',
    'Domestic_Violence_Text': 'Sin reportes'
}

# Preprocesar entrada
new_df = pd.DataFrame([nuevo_caso])
new_scaled = preprocessor.transform(new_df)

# Predecir
pred = model.predict(new_scaled)
proba_nn = pred[0][0]
pred_nn = int(proba_nn > 0.8)  # 0 o 1

# Mostrar resultado
print(f"Red Neuronal: {label_encoder.classes_[pred_nn]} (Probabilidad: {proba_nn:.3f})")
