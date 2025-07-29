const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const healthService = require('../services/healthService');

// Get all passengers
router.get('/', (req, res) => {
  try {
    res.json(global.passengers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching passengers', error: error.message });
  }
});

// Get health issues for form selection
router.get('/health-issues', (req, res) => {
  try {
    const { search } = req.query;
    
    if (search) {
      const results = healthService.searchHealthIssues(search);
      res.json(results);
    } else {
      const allIssues = healthService.getHealthIssuesForForm();
      res.json(allIssues);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching health issues', error: error.message });
  }
});

// Get passenger by ID
router.get('/:id', (req, res) => {
  try {
    const passenger = global.passengers.find(p => p.id === req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.json(passenger);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching passenger', error: error.message });
  }
});

// Create new passenger
router.post('/', (req, res) => {
  try {
    const { name, age, healthIssues, experienceLevel, specialNeeds, emergencyContact } = req.body;
    
    if (!name || !age || experienceLevel === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Assess health based on health issues
    const healthAssessment = healthService.assessPassengerHealth(healthIssues || []);

    const newPassenger = {
      id: Date.now().toString(),
      name,
      age: parseInt(age),
      healthIssues: healthIssues || [],
      healthAssessment,
      experienceLevel: parseInt(experienceLevel),
      specialNeeds: specialNeeds || [],
      emergencyContact: emergencyContact || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    global.passengers.push(newPassenger);
    
    // Emit real-time update
    if (global.io) {
      global.io.emit('passengerCreated', newPassenger);
    }
    
    res.status(201).json(newPassenger);
  } catch (error) {
    res.status(500).json({ message: 'Error creating passenger', error: error.message });
  }
});

// Update passenger
router.put('/:id', (req, res) => {
  try {
    const passengerIndex = global.passengers.findIndex(p => p.id === req.params.id);
    if (passengerIndex === -1) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    const { name, age, healthIssues, experienceLevel, specialNeeds, emergencyContact } = req.body;
    
    // Re-assess health if health issues changed
    const healthAssessment = healthService.assessPassengerHealth(healthIssues || []);
    
    global.passengers[passengerIndex] = {
      ...global.passengers[passengerIndex],
      ...(name && { name }),
      ...(age && { age: parseInt(age) }),
      ...(healthIssues && { healthIssues }),
      ...(healthIssues && { healthAssessment }),
      ...(experienceLevel !== undefined && { experienceLevel: parseInt(experienceLevel) }),
      ...(specialNeeds && { specialNeeds }),
      ...(emergencyContact && { emergencyContact }),
      updatedAt: new Date().toISOString()
    };

    const updatedPassenger = global.passengers[passengerIndex];
    
    // Emit real-time update
    if (global.io) {
      global.io.emit('passengerUpdated', updatedPassenger);
    }
    
    res.json(updatedPassenger);
  } catch (error) {
    res.status(500).json({ message: 'Error updating passenger', error: error.message });
  }
});

// Delete passenger
router.delete('/:id', (req, res) => {
  try {
    const passengerIndex = global.passengers.findIndex(p => p.id === req.params.id);
    if (passengerIndex === -1) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    const deletedPassenger = global.passengers.splice(passengerIndex, 1)[0];
    
    // Emit real-time update
    if (global.io) {
      global.io.emit('passengerDeleted', deletedPassenger);
    }
    
    res.json({ message: 'Passenger deleted successfully', passenger: deletedPassenger });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting passenger', error: error.message });
  }
});

// Get passenger risk assessment
router.get('/:id/risk-assessment', (req, res) => {
  try {
    const passenger = global.passengers.find(p => p.id === req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    const missionData = req.query.missionId ? 
      global.missions.find(m => m.id === req.query.missionId) : 
      { weatherRisk: 50, distance: 5000 };

    const riskAssessment = aiService.assessRisk(passenger, missionData);
    
    res.json({
      passengerId: passenger.id,
      passengerName: passenger.name,
      ...riskAssessment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error assessing risk', error: error.message });
  }
});

// Batch risk assessment for multiple passengers
router.post('/batch-risk-assessment', (req, res) => {
  try {
    const { passengerIds, missionId } = req.body;
    
    if (!passengerIds || !Array.isArray(passengerIds)) {
      return res.status(400).json({ message: 'Passenger IDs array is required' });
    }

    const passengers = global.passengers.filter(p => passengerIds.includes(p.id));
    const missionData = missionId ? 
      global.missions.find(m => m.id === missionId) : 
      { weatherRisk: 50, distance: 5000 };

    const assessments = aiService.batchAssessRisk(passengers, missionData);
    const insights = aiService.getAIInsights(assessments, missionData);
    
    res.json({
      assessments,
      insights
    });
  } catch (error) {
    res.status(500).json({ message: 'Error in batch risk assessment', error: error.message });
  }
});

module.exports = router; 