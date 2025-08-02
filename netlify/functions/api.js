const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

// Import your existing server logic
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import your existing routes and services
// Note: You'll need to adapt your existing server.js logic here
// This is a simplified version for Netlify

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Mission Risk Assessment API is running',
    timestamp: new Date().toISOString()
  });
});

// Mock data endpoints for demo
app.get('/api/passengers', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe', healthScore: 85, experienceLevel: 8 },
    { id: 2, name: 'Jane Smith', healthScore: 92, experienceLevel: 9 },
    { id: 3, name: 'Bob Johnson', healthScore: 78, experienceLevel: 7 }
  ]);
});

app.get('/api/missions', (req, res) => {
  res.json([
    { id: 1, name: 'Mars Mission', status: 'ACTIVE' },
    { id: 2, name: 'Moon Landing', status: 'PLANNED' },
    { id: 3, name: 'Satellite Launch', status: 'COMPLETED' }
  ]);
});

app.get('/api/risks', (req, res) => {
  res.json([
    { id: 1, type: 'Technical', level: 'MEDIUM' },
    { id: 2, type: 'Health', level: 'LOW' },
    { id: 3, type: 'Environmental', level: 'HIGH' }
  ]);
});

app.get('/api/assessments', (req, res) => {
  res.json([
    { 
      id: 1, 
      createdAt: new Date().toISOString(),
      assessments: [{ id: 1 }, { id: 2 }]
    }
  ]);
});

app.get('/api/assessments/statistics/overview', (req, res) => {
  res.json({
    totalAssessments: 25,
    riskDistribution: {
      low: 15,
      medium: 7,
      high: 3
    },
    averageConfidence: 0.85
  });
});

app.get('/api/assessments/ai/status', (req, res) => {
  res.json({
    isTrained: true,
    trainingDataSize: 150,
    modelVersion: '1.0.0'
  });
});

app.post('/api/assessments/ai/retrain', (req, res) => {
  res.json({ 
    message: 'AI model retraining initiated',
    status: 'success'
  });
});

// Handle all other routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Export the serverless function
module.exports.handler = serverless(app); 