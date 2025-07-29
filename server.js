const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Import routes
const passengersRoutes = require('./routes/passengers');
const missionsRoutes = require('./routes/missions');
const risksRoutes = require('./routes/risks');
const assessmentsRoutes = require('./routes/assessments');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.16:3000", "http://192.168.1.16:5000"],
    methods: ["GET", "POST"]
  }
});

// Make io available globally
global.io = io;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Initialize in-memory storage
global.passengers = [];
global.missions = [];
global.risks = [];
global.assessments = [];

// Initialize AI models
const aiService = require('./services/aiService');
console.log('In-memory storage and AI models initialized');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      passengers: global.passengers.length,
      missions: global.missions.length,
      risks: global.risks.length,
      assessments: global.assessments.length
    }
  });
});

// Routes
app.use('/api/passengers', passengersRoutes);
app.use('/api/missions', missionsRoutes);
app.use('/api/risks', risksRoutes);
app.use('/api/assessments', assessmentsRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial data to new client
  socket.emit('initialData', {
    passengers: global.passengers,
    missions: global.missions,
    risks: global.risks,
    assessments: global.assessments
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle real-time updates
  socket.on('missionStatusUpdate', (data) => {
    const { missionId, status } = data;
    const missionIndex = global.missions.findIndex(m => m.id === missionId);
    
    if (missionIndex !== -1) {
      global.missions[missionIndex].status = status;
      global.missions[missionIndex].updatedAt = new Date().toISOString();
      
      // Broadcast update to all clients
      io.emit('missionUpdated', global.missions[missionIndex]);
    }
  });

  socket.on('passengerHealthUpdate', (data) => {
    const { passengerId, healthAssessment } = data;
    const passengerIndex = global.passengers.findIndex(p => p.id === passengerId);
    
    if (passengerIndex !== -1) {
      global.passengers[passengerIndex].healthAssessment = healthAssessment;
      global.passengers[passengerIndex].updatedAt = new Date().toISOString();
      
      // Broadcast update to all clients
      io.emit('passengerUpdated', global.passengers[passengerIndex]);
    }
  });

  socket.on('aiModelRetrain', async () => {
    try {
      console.log('Retraining AI model...');
      await aiService.retrainModel(global.missions, global.passengers, global.risks);
      
      // Broadcast retraining completion
      io.emit('aiModelRetrained', {
        timestamp: new Date().toISOString(),
        success: true
      });
    } catch (error) {
      console.error('AI retraining error:', error);
      io.emit('aiModelRetrained', {
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message
      });
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    dataCounts: {
      passengers: global.passengers.length,
      missions: global.missions.length,
      risks: global.risks.length,
      assessments: global.assessments.length
    }
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Access the app at: http://192.168.1.16:5000');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app; 