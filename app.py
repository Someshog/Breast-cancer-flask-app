from flask import Flask, render_template, request, jsonify
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, ExtraTreesClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score
from scipy.stats import zscore
import joblib
import os
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Global variables for model and scaler
model = None
scaler = None
feature_names = None

def load_or_train_model():
    """Load existing model or train using the notebook's exact approach with cleaned data"""
    global model, scaler, feature_names
    
    model_path = 'models/breast_cancer_model.pkl'
    scaler_path = 'models/scaler.pkl'
    
    try:
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            # Load existing model
            print("Loading existing model...")
            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)
            # Load feature names from dataset
            data = load_breast_cancer()
            feature_names = data.feature_names
            print("Model loaded successfully!")
        else:
            # Train new model using notebook's exact approach
            print("Training model using notebook's approach with cleaned data...")
            
            # Load breast cancer dataset
            data = load_breast_cancer()
            ds = pd.DataFrame(data.data, columns=data.feature_names)
            ds['diagnosis'] = 1 - data.target  # Same as notebook
            feature_names = data.feature_names
            
            # Clean data using Z-score outlier removal (same as notebook)
            features = ds.drop('diagnosis', axis=1).columns
            z_scores = np.abs(zscore(ds[features]))
            row_outliers = (z_scores > 3).any(axis=1)
            clean_ds = ds[~row_outliers].reset_index(drop=True)
            
            print(f"Original dataset shape: {ds.shape}")
            print(f"Cleaned dataset shape: {clean_ds.shape}")
            print(f"Removed {row_outliers.sum()} outlier rows")
            
            # Prepare cleaned data
            x_clean = clean_ds.drop(['diagnosis'], axis=1)
            y_clean = clean_ds['diagnosis']
            
            # Scale the cleaned data
            scaler = StandardScaler()
            x_clean_scaled = scaler.fit_transform(x_clean)
            
            # Split data (same as notebook)
            X_temp_clean, X_test_clean, y_temp_clean, y_test_clean = train_test_split(
                x_clean_scaled, y_clean, test_size=0.15, random_state=42
            )
            X_train_clean, X_val_clean, y_train_clean, y_val_clean = train_test_split(
                X_temp_clean, y_temp_clean, test_size=0.1765, random_state=42
            )
            
            # Define all models (same as notebook)
            models = {
                "Logistic Regression": LogisticRegression(max_iter=3500),
                "Decision Tree": DecisionTreeClassifier(),
                "K-Nearest Neighbors": KNeighborsClassifier(),
                "Support Vector Machine": SVC(probability=True),  # Added probability=True for predict_proba
                "Naive Bayes": GaussianNB(),
                "Random Forest": RandomForestClassifier(),
                "Extra Trees": ExtraTreesClassifier()
            }
            
            # Train & Evaluate on Validation Set (same as notebook)
            validation_results = []
            trained_models = {}
            
            print("Training and evaluating all models...")
            for name, model_instance in models.items():
                model_instance.fit(X_train_clean, y_train_clean)
                val_pred = model_instance.predict(X_val_clean)
                
                acc = accuracy_score(y_val_clean, val_pred)
                f1 = f1_score(y_val_clean, val_pred)
                prec = precision_score(y_val_clean, val_pred)
                rec = recall_score(y_val_clean, val_pred)
                
                validation_results.append([name, acc, f1, prec, rec])
                trained_models[name] = model_instance
                print(f"{name}: F1={f1:.4f}, Acc={acc:.4f}")
            
            # Select Best Model (same as notebook)
            val_df = pd.DataFrame(validation_results,
                                columns=["Model", "Accuracy", "F1 Score", "Precision", "Recall"])
            val_df = val_df.sort_values(by="F1 Score", ascending=False)
            
            best_model_name = val_df.iloc[0]["Model"]
            model = trained_models[best_model_name]
            print(f"✅ Final model selected: {best_model_name}")

            # Test the best model
            y_test_pred = model.predict(X_test_clean)
            test_acc = accuracy_score(y_test_clean, y_test_pred)
            test_f1 = f1_score(y_test_clean, y_test_pred)
            
            print(f"\nBest Model: {best_model_name}")
            print(f"Validation F1: {val_df.iloc[0]['F1 Score']:.4f}")
            print(f"Test Accuracy: {test_acc:.4f}")
            print(f"Test F1: {test_f1:.4f}")
            
            # Create models directory if it doesn't exist
            os.makedirs('models', exist_ok=True)
            
            # Save model and scaler
            joblib.dump(model, model_path)
            joblib.dump(scaler, scaler_path)
            
            print("Model and scaler saved successfully!")
            
    except Exception as e:
        print(f"Error loading/training model: {e}")
        raise
    
    # Load feature names if not already loaded
    if feature_names is None:
        data = load_breast_cancer()
        feature_names = data.feature_names

@app.route('/')
def index():
    """Main page with prediction form"""
    try:
        # Ensure feature_names is loaded
        if feature_names is None:
            print("Warning: feature_names is None, reloading...")
            data = load_breast_cancer()
            globals()['feature_names'] = data.feature_names
        
        return render_template('index.html', feature_names=feature_names)
    except Exception as e:
        print(f"Error in index route: {e}")
        # Fallback: load feature names directly
        try:
            data = load_breast_cancer()
            return render_template('index.html', feature_names=data.feature_names)
        except Exception as e2:
            print(f"Fallback also failed: {e2}")
            return f"Error loading application: {e}", 500

@app.route('/predict', methods=['POST'])
def predict():
    """Handle prediction requests with optimized processing"""
    try:
        # Get form data with validation
        features = []
        missing_fields = []
        
        for feature_name in feature_names:
            value = request.form.get(feature_name)
            if value is None or value == '':
                missing_fields.append(feature_name)
                features.append(0.0)  # Default value for missing fields
            else:
                try:
                    features.append(float(value))
                except ValueError:
                    return jsonify({'error': f'Invalid value for {feature_name}. Please enter a valid number.'}), 400
        
        if missing_fields:
            return jsonify({'error': f'Missing values for: {", ".join(missing_fields[:3])}{"..." if len(missing_fields) > 3 else ""}'}), 400
        
        # Convert to numpy array and reshape (faster processing)
        features_array = np.array(features, dtype=np.float32).reshape(1, -1)
        
        # Scale the features
        features_scaled = scaler.transform(features_array)
        
        # Make prediction (optimized)
        prediction = model.predict(features_scaled)[0]
        prediction_proba = model.predict_proba(features_scaled)[0]
        
        # Prepare result with better formatting
        result = {
            'prediction': 'Benign' if prediction == 0 else 'Malignant',
            'confidence': {
                'malignant': f"{prediction_proba[1]*100:.1f}%",
                'benign': f"{prediction_proba[0]*100:.1f}%"
            },
            'risk_level': 'Low Risk' if prediction == 0 else 'High Risk',
            'confidence_score': float(max(prediction_proba))
        }
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': 'An error occurred during prediction. Please check your input values and try again.'}), 500

@app.route('/about')
def about():
    """About page with information about the model"""
    return render_template('about.html')

@app.route('/api/model-info')
def model_info():
    """API endpoint to get model information"""
    try:
        # Ensure feature_names is available
        if feature_names is None:
            data = load_breast_cancer()
            feature_list = data.feature_names.tolist()
        else:
            feature_list = feature_names.tolist()
            
        model_name = type(model).__name__ if model else "Unknown"
        return jsonify({
            'model_type': model_name,
            'features_count': len(feature_list),
            'feature_names': feature_list,
            'training_approach': 'Cleaned data with outlier removal (Z-score > 3)',
            'model_selection': 'Best F1 score on validation set',
            'data_preprocessing': 'StandardScaler on cleaned dataset'
        })
    except Exception as e:
        print(f"Error in model_info: {e}")
        return jsonify({'error': 'Unable to retrieve model information'}), 500

if __name__ == '__main__':
    # Initialize model
    load_or_train_model()
    
    # Run the app
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
