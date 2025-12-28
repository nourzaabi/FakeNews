FROM python:3.12-slim

WORKDIR /app

# Copier les fichiers
COPY requirements.txt .

# Installer dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le projet
COPY . .

# Exposer le port de l’API
EXPOSE 8000

# Lancer l’API
CMD ["uvicorn", "src.api.app:app", "--host", "0.0.0.0", "--port", "8000"]
