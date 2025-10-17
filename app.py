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
    # We apply transformations to numerical/categorical columns and pass the rest through.
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, [col for col in numerical_features if col not in sensitive_features_list]),
            ('cat', categorical_transformer, [col for col in categorical_features if col not in sensitive_features_list])
        ],
        remainder='passthrough'  # This keeps sensitive features in the dataset
    )

    # --- Model Training ---
    # Create the full pipeline
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', DecisionTreeClassifier(random_state=42))
    ])

    # Train the model (using the entire dataset for the final API model)
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

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for all routes

# --- Load the Model and Data Columns ---
# This part runs only once when the server starts.
try:
    # Check if the model file exists, if not, train it.
    if not os.path.exists(MODEL_FILENAME):
        print(f"'{MODEL_FILENAME}' not found. Running training process...")
        if not train_and_save_model():
            exit() # Exit if training fails (e.g., data.csv not found)
    
    # Load the pre-trained model pipeline
    model_pipeline = joblib.load(MODEL_FILENAME)
    print(f"✅ Model pipeline '{MODEL_FILENAME}' loaded successfully.")

    # Load column names from the original dataset to ensure API input consistency
    original_df_columns = pd.read_csv(DATA_FILENAME, sep=';', quotechar='"').drop('Target', axis=1).columns.tolist()
    print("✅ Original data columns loaded for input validation.")

except Exception as e:
    print(f"❌ An error occurred during initialization: {e}")
    exit()

# --- API Routes ---
@app.route('/')
def index():
    """A simple root endpoint to confirm the API is running."""
    return "✅ Student Outcome Prediction API is running."

@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives student data in JSON format, preprocesses it, and returns a prediction.
    """
    try:
        # Get data from the POST request's JSON body
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Convert incoming JSON data (can be a single record or a list) to a DataFrame
        # The 'orient="records"' is important if you send a list of dictionaries
        input_df = pd.DataFrame.from_records(data)

        # Ensure the DataFrame has all the necessary columns in the correct order
        # This handles cases where the input might be missing columns.
        input_df = input_df.reindex(columns=original_df_columns, fill_value=None)

        # Use the loaded pipeline to preprocess and predict
        predictions = model_pipeline.predict(input_df)

        # Return the predictions as a JSON response
        return jsonify(predictions.tolist())

    except Exception as e:
        # Log the error for debugging and return a generic server error message
        app.logger.error(f"An error occurred during prediction: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), 500

# ==============================================================================
# 3. RUN THE APPLICATION
# ==============================================================================
if __name__ == '__main__':
    # This block starts the Flask server when you run 'python app.py'
    # host='0.0.0.0' makes the app accessible on your local network
    # port=8080 is a standard port for development
    print("🚀 Starting Flask server...")
    print("➡️  Access the API at http://127.0.0.1:8080")
    app.run(host='0.0.0.0', port=8080, debug=True)