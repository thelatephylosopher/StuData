import os
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.tree import DecisionTreeClassifier
import numpy as np

# --- Define Constants ---
MODEL_FILENAME = 'model_pipeline.joblib'
DATA_FILENAME = 'data.csv'

# ==============================================================================
# 1. MODEL TRAINING FUNCTION
# ==============================================================================
def train_and_save_model():
    """
    Loads the dataset, trains the model pipeline, and saves it to a file.
    This function is run once when the application starts if the model file
    doesn't already exist.
    """
    print("--- Starting Model Training ---")

    # Load the dataset from CSV
    try:
        df = pd.read_csv(DATA_FILENAME, sep=';', quotechar='"')
        print(f"✅ Dataset '{DATA_FILENAME}' loaded successfully.")
    except FileNotFoundError:
        print(f"❌ ERROR: '{DATA_FILENAME}' not found. Please make sure it's in the same directory.")
        return False

    # --- Data Preprocessing ---
    X = df.drop('Target', axis=1)
    y = df['Target']

    # Define sensitive features (they will be passed through, not transformed)
    sensitive_features_list = [
        'Marital status', 'Application mode', 'Course', 'Previous qualification',
        'Nacionality', "Mother's qualification", 'Educational special needs',
        'Tuition fees up to date', 'Gender', 'Age at enrollment', 'International'
    ]

    # Identify categorical and numerical features for transformation
    categorical_features = X.select_dtypes(include=['object']).columns
    numerical_features = X.select_dtypes(include=['int64', 'float64']).columns

    # Create transformers
    numerical_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')

    # Create a preprocessor with ColumnTransformer
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, [col for col in numerical_features if col not in sensitive_features_list]),
            ('cat', categorical_transformer, [col for col in categorical_features if col not in sensitive_features_list])
        ],
        remainder='passthrough'
    )

    # --- Model Training ---
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', DecisionTreeClassifier(random_state=42))
    ])

    print("⏳ Training the classification model...")
    model_pipeline.fit(X, y)
    print("✅ Model training complete.")

    # Save the trained model pipeline to a file
    joblib.dump(model_pipeline, MODEL_FILENAME)
    print(f"✅ Model pipeline saved successfully as '{MODEL_FILENAME}'.")
    return True

# ==============================================================================
# 2. FLASK API SETUP
# ==============================================================================

app = Flask(__name__)
CORS(app)

# --- Load the Model and Data ---
try:
    if not os.path.exists(MODEL_FILENAME):
        print(f"'{MODEL_FILENAME}' not found. Running training process...")
        if not train_and_save_model():
            exit()
    
    model_pipeline = joblib.load(MODEL_FILENAME)
    print(f"✅ Model pipeline '{MODEL_FILENAME}' loaded successfully.")

    df = pd.read_csv(DATA_FILENAME, sep=';', quotechar='"')
    # Add a unique ID to each row for easy fetching
    df['id'] = range(1, len(df) + 1)
    
    original_df_columns = df.drop(['Target', 'id'], axis=1).columns.tolist()
    print("✅ Original data columns loaded for input validation.")

except Exception as e:
    print(f"❌ An error occurred during initialization: {e}")
    exit()

# --- API Routes ---
@app.route('/')
def index():
    """A simple root endpoint to confirm the API is running."""
    return "✅ Student Outcome Prediction API is running."

@app.route('/data', methods=['GET'])
def get_data():
    """Returns the entire student dataset as JSON."""
    # Replace NaN with None for JSON compatibility
    df_json = df.replace({np.nan: None})
    return jsonify(df_json.to_dict(orient='records'))

@app.route('/student/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """Returns data for a single student by ID."""
    student_data_df = df[df['id'] == student_id]
    if student_data_df.empty:
        return jsonify({"error": "Student not found"}), 404
    
    # Replace NaN with None for JSON compatibility
    student_data_json = student_data_df.replace({np.nan: None})
    return jsonify(student_data_json.to_dict(orient='records')[0])

@app.route('/predict', methods=['POST'])
def predict():
    """Receives student data and returns a prediction."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        input_df = pd.DataFrame.from_records(data)
        input_df = input_df.reindex(columns=original_df_columns, fill_value=0)

        predictions = model_pipeline.predict(input_df)
        return jsonify(predictions.tolist())

    except Exception as e:
        app.logger.error(f"An error occurred during prediction: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), 500

# ==============================================================================
# 3. RUN THE APPLICATION
# ==============================================================================
if __name__ == '__main__':
    print("🚀 Starting Flask server...")
    print("➡️  Access the API at http://127.0.0.1:8080")
    app.run(host='0.0.0.0', port=8080, debug=True)
