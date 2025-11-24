# Unmask - React Frontend

A React-based frontend for the Unmask fake news detection application.

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The app will run on `http://localhost:3000` and proxy API requests to the Flask backend at `http://localhost:5000`.

## Project Structure

\`\`\`
react-frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
└── index.html          # HTML template
\`\`\`

## Building for Production

\`\`\`bash
npm run build
\`\`\`

The built files will be in the `dist/` directory.

## API Integration

The app expects a Flask backend running on `http://localhost:5000` with the following endpoints:

- `POST /predict/text` - Analyze text content
- `POST /predict/file` - Analyze uploaded file
- `POST /predict/url` - Analyze URL content

Make sure the Flask backend is running before starting the React app.
