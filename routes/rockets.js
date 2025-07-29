const express = require('express');
const router = express.Router();
const rocketService = require('../services/rocketService');

// Get all rockets
router.get('/', (req, res) => {
  try {
    const rockets = rocketService.getAllRockets();
    res.json(rockets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rockets', error: error.message });
  }
});

// Get rocket by ID
router.get('/:id', (req, res) => {
  try {
    const rocket = rocketService.getRocketById(req.params.id);
    if (!rocket) {
      return res.status(404).json({ message: 'Rocket not found' });
    }
    res.json(rocket);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rocket', error: error.message });
  }
});

// Calculate fuel consumption for a mission
router.post('/:id/fuel-calculation', (req, res) => {
  try {
    const { distance, payload } = req.body;
    
    if (!distance || !payload) {
      return res.status(400).json({ message: 'Distance and payload are required' });
    }

    const fuelAnalysis = rocketService.calculateFuelConsumption(req.params.id, distance, payload);
    res.json(fuelAnalysis);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating fuel consumption', error: error.message });
  }
});

// Get suitable rockets for a mission
router.post('/suitable', (req, res) => {
  try {
    const { distance, payload } = req.body;
    
    if (!distance || !payload) {
      return res.status(400).json({ message: 'Distance and payload are required' });
    }

    const suitableRockets = rocketService.getSuitableRockets(distance, payload);
    res.json(suitableRockets);
  } catch (error) {
    res.status(500).json({ message: 'Error finding suitable rockets', error: error.message });
  }
});

// Calculate mission cost
router.post('/:id/mission-cost', (req, res) => {
  try {
    const { distance, payload } = req.body;
    
    if (!distance || !payload) {
      return res.status(400).json({ message: 'Distance and payload are required' });
    }

    const costAnalysis = rocketService.calculateMissionCost(req.params.id, distance, payload);
    res.json(costAnalysis);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating mission cost', error: error.message });
  }
});

// Get rocket statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = rocketService.getRocketStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rocket statistics', error: error.message });
  }
});

// Compare rockets for a mission
router.post('/compare', (req, res) => {
  try {
    const { rocketIds, distance, payload } = req.body;
    
    if (!rocketIds || !Array.isArray(rocketIds) || !distance || !payload) {
      return res.status(400).json({ message: 'Rocket IDs array, distance, and payload are required' });
    }

    const comparison = rocketIds.map(rocketId => {
      try {
        const fuelAnalysis = rocketService.calculateFuelConsumption(rocketId, distance, payload);
        const costAnalysis = rocketService.calculateMissionCost(rocketId, distance, payload);
        const rocket = rocketService.getRocketById(rocketId);
        
        return {
          rocketId,
          rocketName: rocket.name,
          manufacturer: rocket.manufacturer,
          fuelAnalysis,
          costAnalysis,
          reliability: rocket.reliability,
          payloadCapacity: rocket.payloadCapacity.LEO,
          suitability: fuelAnalysis.canCompleteMission ? 'SUITABLE' : 'UNSUITABLE'
        };
      } catch (error) {
        return {
          rocketId,
          error: error.message
        };
      }
    });

    res.json(comparison);
  } catch (error) {
    res.status(500).json({ message: 'Error comparing rockets', error: error.message });
  }
});

module.exports = router; 