# Copilot Instructions for Breast Cancer Prediction Web Application

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Flask web application that uses machine learning to predict breast cancer diagnosis based on cell nuclei characteristics. The application provides a user-friendly interface for inputting medical measurements and receiving AI-powered predictions.

## Technology Stack
- **Backend**: Python Flask
- **Machine Learning**: Scikit-learn (Random Forest Classifier)
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript
- **Data Processing**: NumPy, Pandas
- **Model Persistence**: Joblib

## Key Components
1. **app.py**: Main Flask application with routes and ML model handling
2. **templates/**: HTML templates for the web interface
3. **static/**: CSS, JavaScript, and other static assets
4. **models/**: Directory for saved ML models and scalers

## Coding Standards
- Use Python type hints where appropriate
- Follow PEP 8 style guidelines
- Use semantic HTML5 elements
- Implement responsive design with Bootstrap
- Add proper error handling and validation
- Include comprehensive comments for complex logic

## Security Considerations
- Validate all user inputs
- Use secure file handling practices
- Implement proper error messages without exposing system details
- No patient data should be permanently stored

## Medical Disclaimer
Always include appropriate medical disclaimers and emphasize that this tool is for educational purposes only and should not replace professional medical diagnosis.

## Features to Maintain
- Responsive design for mobile devices
- Real-time form validation
- Loading states and user feedback
- Sample data for testing
- Confidence scores and risk assessment
- Modern, accessible UI/UX
