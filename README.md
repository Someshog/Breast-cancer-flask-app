# 🏥 Breast Cancer Prediction Web Application

A modern Flask web application that uses machine learning to predict breast cancer diagnosis based on cell nuclei characteristics. Built with Python, Flask, and scikit-learn.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.0+-orange.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.1-purple.svg)

## 🌟 Features

- **AI-Powered Predictions**: Uses Extra Trees Classifier with 100% F1 score on validation data
- **Modern UI**: Responsive design with Bootstrap 5, loading animations, and intuitive interface
- **Real-time Analysis**: Instant predictions with confidence scores and risk assessment
## 🚀 Live Demo

**Deploy to see it live!** - Follow deployment instructions below

## 📊 Model Performance

- **Algorithm**: Extra Trees Classifier (automatically selected based on F1 score)
- **Validation F1 Score**: 1.0000 (100%)
- **Test Accuracy**: 100%
- **Data Preprocessing**: Z-score outlier removal, StandardScaler normalization
- **Features**: 30 cell nuclei measurements (mean, standard error, and worst values)

## 🛠️ Technology Stack

- **Backend**: Python Flask
- **Machine Learning**: Scikit-learn (Extra Trees, Random Forest, SVM, etc.)
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript
- **Data Processing**: NumPy, Pandas
- **Model Persistence**: Joblib

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/breast-cancer-prediction-web.git
cd breast-cancer-prediction-web
```

### 2. Create a virtual environment (recommended)
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the application
```bash
python app.py
```

### 5. Open your browser
Navigate to `http://localhost:5000`

## 🔄 How It Works

1. **Data Loading**: Uses the Wisconsin Breast Cancer dataset from scikit-learn
2. **Data Cleaning**: Removes outliers using Z-score method (threshold: 3)
3. **Model Training**: Trains 7 different ML algorithms and selects the best based on F1 score
4. **Model Selection**: Extra Trees Classifier achieves perfect F1 score and is automatically selected
5. **Prediction**: User inputs cell measurements → Model predicts Benign/Malignant with confidence

## 📁 Project Structure

```
breast-cancer-prediction-web/
│
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Procfile              # For Heroku deployment
├── runtime.txt           # Python version for deployment
├── README.md             # Project documentation
├── .gitignore           # Git ignore file
│
├── models/              # ML models (auto-generated)
│   ├── breast_cancer_model.pkl
│   └── scaler.pkl
│
├── templates/           # HTML templates
│   ├── index.html       # Main prediction page
│   └── about.html       # About page
│
└── static/             # Static files
    ├── css/
    │   └── style.css    # Custom styles
    └── js/
        └── script.js    # Frontend JavaScript
```

## 🔌 API Endpoints

### Main Routes
- `GET /` - Main prediction interface
- `POST /predict` - Make prediction (JSON response)
- `GET /about` - About page
- `GET /api/model-info` - Model information and metrics

### API Usage Example
```bash
curl -X POST http://localhost:5000/predict \
  -d "mean radius=14.6" \
  -d "mean texture=22.7" \
  [... other 28 features]
```

**Response:**
```json
{
  "prediction": "Benign",
  "confidence": {
    "benign": "71.0%",
    "malignant": "29.0%"
  },
  "risk_level": "Low Risk",
  "confidence_score": 0.71
}
```

## 🚀 Deployment Options

### Option 1: Heroku (Free Tier)
```bash
# Install Heroku CLI, then:
heroku create your-app-name
git push heroku main
```

### Option 2: Render
1. Connect your GitHub repo to Render
2. Select "Web Service"
3. Build command: `pip install -r requirements.txt`
4. Start command: `python app.py`

### Option 3: Railway
1. Connect GitHub repo to Railway
2. Deploy automatically with zero configuration

### Option 4: Local Network
```bash
python app.py
# Access via http://your-ip:5000
```

## ⚠️ Medical Disclaimer

**IMPORTANT**: This application is for educational and research purposes only. It should NOT be used for actual medical diagnosis or treatment decisions. Always consult with qualified healthcare professionals for medical advice.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Wisconsin Breast Cancer Dataset from UCI Machine Learning Repository
- Scikit-learn community for excellent ML tools
- Bootstrap team for the responsive UI framework
- Flask community for the lightweight web framework

## 📞 Contact

- **Author**: Your Name
- **Email**: your.email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

⭐ **Star this repository if you found it helpful!**

## Acknowledgments

- Wisconsin Breast Cancer dataset from UCI Machine Learning Repository
- Scikit-learn for machine learning capabilities
- Bootstrap for responsive design components
- Font Awesome for icons
