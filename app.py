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
import shap  # --- Import SHAP ---
import re

# --- Define Constants ---
MODEL_FILENAME = 'model_pipeline.joblib'
DATA_FILENAME = 'data.csv'

# --- Globals for Explainer (to be populated on startup) ---
preprocessor = None
classifier = None
shap_explainer = None
original_df_columns = []
transformed_feature_names = []
feature_mapping = {} # Maps original feature names to transformed indices
global_importances = []

# ==============================================================================
# 0. HELPER FUNCTIONS FOR EXPLAINABILITY
# ==============================================================================

def _get_original_feature_mapping(transformed_names, original_cols):
    """
    Creates a mapping from original feature names to their corresponding
    indices in the transformed feature array.
    """
    mapping = {}
    
    # Regex to clean up the transformer prefixes
    num_pattern = re.compile(r'^num__')
    cat_pattern = re.compile(r'^cat__')
    rem_pattern = re.compile(r'^remainder__')

    for i, transformed_name in enumerate(transformed_names):
        original_name = transformed_name
        
        if num_pattern.match(original_name):
            original_name = num_pattern.sub('', original_name)
        elif cat_pattern.match(original_name):
            original_name = cat_pattern.sub('', original_name)
            # For one-hot encoded features, get the base feature name
            # e.g., "Course_9003" -> "Course"
            original_name = '_'.join(original_name.split('_')[:-1])
        elif rem_pattern.match(original_name):
            original_name = rem_pattern.sub('', original_name)

        # Ensure the name is one of the original columns
        if original_name in original_cols:
            if original_name not in mapping:
                mapping[original_name] = []
            mapping[original_name].append(i)
            
    return mapping

def _aggregate_importances(importances, mapping):
    """
    Aggregates importances (feature_importance_ or SHAP values)
    from transformed features back to original features.
    """
    aggregated = {}
    for original_name, indices in mapping.items():
        # Sum the absolute importances/SHAP values for all related transformed features
        aggregated[original_name] = sum(importances[i] for i in indices)
        
    # Sort by absolute value, descending
    sorted_importances = sorted(
        aggregated.items(),
        key=lambda item: abs(item[1]),
        reverse=True
    )
    
    # Format for JSON output
    return [{"name": name, "value": value} for name, value in sorted_importances]


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
    
    # Use globals
    global preprocessor, classifier, shap_explainer, original_df_columns, \
           transformed_feature_names, feature_mapping, global_importances

    # Load the dataset from CSV
    try:
        df = pd.read_csv(DATA_FILENAME, sep=';', quotechar='"')
        print(f"✅ Dataset '{DATA_FILENAME}' loaded successfully.")
    except FileNotFoundError:
        print(f"❌ ERROR: '{DATA_FILENAME}' not found. Please make sure it's in the same directory.")
        return False, None, None # Return False and Nones

    # --- Data Preprocessing ---
    X = df.drop('Target', axis=1)
    y = df['Target']
    original_df_columns = X.columns.tolist() # Save original column names

    # Define sensitive features
    sensitive_features_list = [
        'Marital status', 'Application mode', 'Course', 'Previous qualification',
        'Nacionality', "Mother's qualification", 'Educational special needs',
        'Tuition fees up to date', 'Gender', 'Age at enrollment', 'International'
    ]

    categorical_features = X.select_dtypes(include=['object']).columns
    numerical_features = X.select_dtypes(include=['int64', 'float64']).columns

    numerical_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numerical_transformer, [col for col in numerical_features if col not in sensitive_features_list]),
            ('cat', categorical_transformer, [col for col in categorical_features if col not in sensitive_features_list])
        ],
        remainder='passthrough'
    )

    # --- Model Training ---
    classifier = DecisionTreeClassifier(random_state=42)
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', classifier)
    ])

    print("⏳ Training the classification model...")
    model_pipeline.fit(X, y)
    print("✅ Model training complete.")

    joblib.dump(model_pipeline, MODEL_FILENAME)
    print(f"✅ Model pipeline saved successfully as '{MODEL_FILENAME}'.")
    
    # --- Return X and y for explainer initialization ---
    return True, model_pipeline, X, y

# ==============================================================================
# 2. FLASK API SETUP
# ==============================================================================

app = Flask(__name__)
CORS(app)

# --- Load Model, Data, and Initialize Explainers ---
try:
    df = None
    X_train_data = None
    y_train_data = None
    model_pipeline = None

    if not os.path.exists(MODEL_FILENAME):
        print(f"'{MODEL_FILENAME}' not found. Running training process...")
        success, model_pipeline, X_train_data, y_train_data = train_and_save_model()
        if not success:
            exit()
    else:
        model_pipeline = joblib.load(MODEL_FILENAME)
        print(f"✅ Model pipeline '{MODEL_FILENAME}' loaded successfully.")

    # Load data (needed for explainers even if model is loaded)
    df = pd.read_csv(DATA_FILENAME, sep=';', quotechar='"')
    df['id'] = range(1, len(df) + 1)
    
    if X_train_data is None:
         X_train_data = df.drop(['Target', 'id'], axis=1)
         # y_train_data = df['Target'] # Not needed if just transforming X

    # --- Populate global explainer variables ---
    print("⏳ Initializing model explainers...")
    preprocessor = model_pipeline.named_steps['preprocessor']
    classifier = model_pipeline.named_steps['classifier']
    
    # Store original column names in the order the preprocessor expects
    original_df_columns = X_train_data.columns.tolist() 
    
    # Get transformed feature names
    transformed_feature_names = preprocessor.get_feature_names_out(original_df_columns)
    
    # Create the feature mapping
    feature_mapping = _get_original_feature_mapping(transformed_feature_names, original_df_columns)
    
    # --- Initialize SHAP Explainer (for local explanations) ---
    # We need to transform the training data to "prime" the explainer
    X_train_transformed = preprocessor.transform(X_train_data)
    shap_explainer = shap.TreeExplainer(classifier, X_train_transformed)
    print("✅ SHAP explainer initialized.")

    # --- Get Global Importances (for global explanations) ---
    raw_global_importances = classifier.feature_importances_
    global_importances = _aggregate_importances(raw_global_importances, feature_mapping)
    print("✅ Global feature importances calculated.")

except Exception as e:
    print(f"❌ An error occurred during initialization: {e}")
    exit()

# --- API Routes ---
@app.route('/')
def index():
    return "✅ Student Outcome Prediction API is running."

@app.route('/data', methods=['GET'])
def get_data():
    df_json = df.replace({np.nan: None})
    return jsonify(df_json.to_dict(orient='records'))

@app.route('/student/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student_data_df = df[df['id'] == student_id]
    if student_data_df.empty:
        return jsonify({"error": "Student not found"}), 404
    
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
# 3. NEW EXPLAINABILITY ENDPOINTS
# ==============================================================================

@app.route('/explain/global', methods=['GET'])
def get_global_explanation():
    """
    Returns the top global feature importances for the model.
    """
    # Return the top 10 most important features globally
    return jsonify(global_importances[:10])


@app.route('/explain/local/<int:student_id>', methods=['GET'])
def get_local_explanation(student_id):
    """
    Returns the top local feature importances (SHAP values)
    for a single student's prediction.
    """
    try:
        # 1. Get the student's original data
        student_data_df = df[df['id'] == student_id]
        if student_data_df.empty:
            return jsonify({"error": "Student not found"}), 404
            
        # Prepare the single row for the preprocessor
        X_student_row = student_data_df.drop(['Target', 'id'], axis=1)
        X_student_row = X_student_row.reindex(columns=original_df_columns, fill_value=0)
        
        # 2. Transform the data
        student_transformed = preprocessor.transform(X_student_row)
        
        # 3. Get the prediction
        prediction = classifier.predict(student_transformed)[0]
        prediction_index = np.where(classifier.classes_ == prediction)[0][0]
        
        # 4. Calculate SHAP values
        # shap_values[0] = values for first instance
        # shap_values.values[0] = values for 1st instance (all classes)
        # shap_values.values[0, :, prediction_index] = values for 1st instance, for the predicted class
        shap_values = shap_explainer(student_transformed)
        local_shap_values = shap_values.values[0, :, prediction_index]

        # 5. Aggregate SHAP values back to original feature names
        aggregated_shap_values = _aggregate_importances(local_shap_values, feature_mapping)
        
        # 6. Return top 5 factors
        return jsonify(aggregated_shap_values[:5])

    except Exception as e:
        app.logger.error(f"An error occurred during local explanation: {e}")
        return jsonify({'error': 'An internal server error occurred.'}), 500


# ==============================================================================
# 4. RUN THE APPLICATION
# ==============================================================================
if __name__ == '__main__':
    print("🚀 Starting Flask server...")
    print("➡️  Access the API at  https://studata.onrender.com ")
    app.run(host='127.0.0.1', port=8080, debug=False) # Debug=True can cause issues with SHAP