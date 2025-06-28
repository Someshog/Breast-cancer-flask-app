import joblib

# Load and check the saved model
model = joblib.load('models/breast_cancer_model.pkl')
print(f"Currently saved model type: {type(model).__name__}")
