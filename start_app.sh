#!/bin/bash
echo "Starting FakeNews System..."

# Function to kill processes on exit
cleanup() {
    echo "Stopping processes..."
    kill $BACKEND_PID $FRONTEND_PID
    exit
}

trap cleanup SIGINT

# Start Backend
echo "Starting Backend (loading AI model, please wait)..."
cd backend
# Ensure dependencies are installed
./venv/bin/pip install bitsandbytes transformers accelerate sentencepiece protobuf > /dev/null 2>&1
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 5000 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Frontend..."
cd frontend
BROWSER=none npm start &
FRONTEND_PID=$!
cd ..

echo "System running."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "Press Ctrl+C to stop."

wait
