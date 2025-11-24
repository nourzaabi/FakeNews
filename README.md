# Fake News Detection System

A comprehensive AI-powered system for detecting fake news using BERT-based machine learning models.

## 🏗️ Project Structure

```
project_root/
│
├── backend/                     # Flask Backend
│   ├── api/                     # Flask API code
│   │   ├── __init__.py          # Initializes the Flask app
│   │   ├── main.py              # Main Flask application setup
│   │   ├── endpoints.py         # API routes (e.g., /predict for predictions)
│   ├── models/                  # Model-related code (training, evaluation)
│   │   ├── __init__.py          # Initializes the models
│   │   ├── architecture.py      # Defines the BERT architecture
│   │   ├── training.py          # Code for training the model
│   ├── utils/                   # Utility functions (e.g., config, metrics)
│   │   ├── __init__.py          # Initializes utilities
│   │   ├── config.py            # Configuration settings
│   │   ├── metrics.py           # Performance metrics for model evaluation
│   ├── requirements.txt         # Python dependencies
│   └── Dockerfile               # Dockerfile for the Flask app
│
├── frontend/                    # React Frontend
│   ├── public/                  # Static assets
│   ├── src/                     # React app source code
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Pages for different sections
│   │   ├── App.js               # Main React app setup and routing
│   │   ├── index.js             # Entry point for React app
│   ├── package.json             # React app dependencies
│   ├── Dockerfile               # Dockerfile for React app
│   └── nginx.conf               # Nginx configuration
│
├── data/                         # Data handling
│   ├── dataset.py                # Code for loading and splitting datasets
│   ├── preprocessing.py          # Text preprocessing
│   ├── data_exploration.py      # Initial data exploration and analysis
│
├── docker/                       # Docker-related files
│   ├── docker-compose.yml        # Orchestrates multi-container deployment
│
├── tests/                        # Unit tests
│   ├── test_data.py              # Tests for data handling
│   ├── test_models.py            # Tests for model training and evaluation
│   ├── test_api.py               # Tests for Flask API routes
│
├── notebooks/                    # Jupyter notebooks for experimentation
│   ├── 01_data_exploration.ipynb  # Exploration of the dataset
│   ├── 02_model_training.ipynb    # Model training and tuning
│   ├── 03_model_evaluation.ipynb  # Model evaluation and testing
│
├── .gitignore                    # Git ignore file
├── requirements.txt              # Python dependencies
└── README.md                     # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Docker (optional)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fake-news-detector
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### Option 1: Docker (Recommended)
```bash
cd docker
docker-compose up --build
```

#### Option 2: Manual Setup
```bash
# Terminal 1 - Backend
cd backend
python api/main.py

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🔧 Configuration

### Environment Variables
- `MODEL_PATH`: Path to the trained model file
- `FLASK_ENV`: Flask environment (development/production)
- `REACT_APP_API_URL`: Backend API URL for frontend

### Model Configuration
Edit `backend/utils/config.py` to adjust:
- Model parameters
- Training settings
- Data paths
- API settings

## 📊 API Endpoints

### Health Check
```
GET /api/health
```

### Text Prediction
```
POST /api/predict
Content-Type: application/json

{
  "text": "Your news article text here"
}
```

### File Prediction
```
POST /api/predict-file
Content-Type: multipart/form-data

file: [uploaded file]
```

### URL Prediction
```
POST /api/predict-url
Content-Type: application/json

{
  "url": "https://example.com/article"
}
```

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
cd backend
python -m pytest ../tests/ -v

# Frontend tests
cd frontend
npm test
```

### Run Specific Test Suites
```bash
# Data tests
python -m pytest tests/test_data.py -v

# Model tests
python -m pytest tests/test_models.py -v

# API tests
python -m pytest tests/test_api.py -v
```

## 📈 Model Training

### Data Preparation
1. Place your dataset in the `data/` directory
2. Update the data path in `backend/utils/config.py`
3. Run data preprocessing:
   ```python
   from data.dataset import FakeNewsDataset
   from data.preprocessing import TextPreprocessor
   
   # Load and preprocess data
   dataset = FakeNewsDataset('data/your_dataset.csv')
   data = dataset.load_data()
   processed_data = dataset.preprocess_data()
   ```

### Training the Model
```python
from backend.models.architecture import FakeNewsDetector
from backend.models.training import ModelTrainer

# Initialize trainer
trainer = ModelTrainer()

# Train the model
trainer.train(X_train, y_train, X_val, y_val)
```

## 🐳 Docker Deployment

### Build and Run
```bash
cd docker
docker-compose up --build
```

### Services
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Redis**: localhost:6379

## 📝 Development

### Code Style
- Backend: Follow PEP 8 guidelines
- Frontend: Use ESLint configuration
- Use Black for Python formatting
- Use Prettier for JavaScript formatting

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 🔍 Monitoring and Logging

### Logs
- Application logs: `logs/app.log`
- Model training logs: `logs/training.log`
- API logs: `logs/api.log`

### Metrics
- Model performance metrics
- API response times
- Error rates
- User interactions

## 🛠️ Troubleshooting

### Common Issues

1. **Model not loading**
   - Check if model file exists
   - Verify model path in config
   - Ensure PyTorch is installed

2. **API connection errors**
   - Check if backend is running
   - Verify CORS settings
   - Check network connectivity

3. **Frontend build errors**
   - Clear node_modules and reinstall
   - Check Node.js version
   - Verify all dependencies

### Debug Mode
```bash
# Backend debug
export FLASK_ENV=development
python api/main.py

# Frontend debug
npm start
```

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Model Architecture](docs/model.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](docs/contributing.md)

## 🤝 Support

- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)
- Email: support@fakenewsdetector.com
- Documentation: [Read the docs](https://docs.fakenewsdetector.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- BERT model by Google Research
- Transformers library by Hugging Face
- React community
- Flask community