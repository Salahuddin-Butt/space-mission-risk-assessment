const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const planetService = require('../services/planetService');

// Get all missions
router.get('/', (req, res) => {
  try {
    res.json(global.missions || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching missions', error: error.message });
  }
});



// Create new mission
router.post('/', (req, res) => {
  try {
    const { name, destinationId, rocketId, crewCount, departureTime, description } = req.body;

    // Validate required fields
    if (!name || !destinationId || !rocketId || !crewCount || !departureTime) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, destinationId, rocketId, crewCount, departureTime' 
      });
    }

    // Validate rocket and destination compatibility
    const validation = planetService.validateRocketForMission(rocketId, destinationId, crewCount);
    if (!validation.valid) {
      return res.status(400).json({ 
        message: 'Mission validation failed', 
        reason: validation.reason 
      });
    }

    const { rocket, destination, route } = validation;

    // Calculate mission details
    const missionDuration = route.travelTime.days;
    const returnTime = new Date(departureTime);
    returnTime.setDate(returnTime.getDate() + missionDuration);

    const newMission = {
      id: Date.now().toString(),
      name,
      destination: {
        id: destinationId,
        name: destination.name,
        distance: destination.distance,
        gravity: destination.gravity,
        atmosphere: destination.atmosphere,
        temperature: destination.temperature,
        radiation: destination.radiation,
        missionComplexity: destination.missionComplexity
      },
      rocket: {
        id: rocketId,
        name: rocket.name,
        payloadCapacity: rocket.payloadCapacity,
        maxDistance: rocket.maxDistance,
        fuelEfficiency: rocket.fuelEfficiency,
        reliability: rocket.reliability,
        cost: rocket.cost,
        crewCapacity: rocket.crewCapacity
      },
      route: {
        distance: route.distance,
        travelTime: route.travelTime,
        fuelRequired: route.fuelRequired,
        complexity: route.complexity,
        waypoints: route.waypoints,
        risks: route.risks
      },
      crewCount: parseInt(crewCount),
      departureTime,
      returnTime: returnTime.toISOString(),
      duration: missionDuration,
      status: 'PLANNED',
      passengers: [],
      riskAssessment: null,
      routeOptimization: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Calculate initial risk assessment
    const riskAssessment = aiService.assessMissionRisk(newMission, global.passengers || []);
    newMission.riskAssessment = riskAssessment;

    global.missions.push(newMission);

    // Emit real-time update
    if (global.io) {
      global.io.emit('missionCreated', newMission);
    }

    res.status(201).json(newMission);
  } catch (error) {
    res.status(500).json({ message: 'Error creating mission', error: error.message });
  }
});

// Update mission
router.put('/:id', (req, res) => {
  try {
    const missionIndex = global.missions.findIndex(m => m.id === req.params.id);
    if (missionIndex === -1) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    const { name, destinationId, rocketId, crewCount, departureTime, description, status } = req.body;
    const mission = global.missions[missionIndex];

    // If destination or rocket changed, revalidate
    if (destinationId && destinationId !== mission.destination.id) {
      const validation = planetService.validateRocketForMission(rocketId || mission.rocket.id, destinationId, crewCount || mission.crewCount);
      if (!validation.valid) {
        return res.status(400).json({ 
          message: 'Mission validation failed', 
          reason: validation.reason 
        });
      }
      
      const { rocket, destination, route } = validation;
      mission.destination = {
        id: destinationId,
        name: destination.name,
        distance: destination.distance,
        gravity: destination.gravity,
        atmosphere: destination.atmosphere,
        temperature: destination.temperature,
        radiation: destination.radiation,
        missionComplexity: destination.missionComplexity
      };
      mission.route = {
        distance: route.distance,
        travelTime: route.travelTime,
        fuelRequired: route.fuelRequired,
        complexity: route.complexity,
        waypoints: route.waypoints,
        risks: route.risks
      };
    }

    // Update fields
    if (name) mission.name = name;
    if (rocketId && rocketId !== mission.rocket.id) {
      const rocket = planetService.getRocket(rocketId);
      if (rocket) {
        mission.rocket = {
          id: rocketId,
          name: rocket.name,
          payloadCapacity: rocket.payloadCapacity,
          maxDistance: rocket.maxDistance,
          fuelEfficiency: rocket.fuelEfficiency,
          reliability: rocket.reliability,
          cost: rocket.cost,
          crewCapacity: rocket.crewCapacity
        };
      }
    }
    if (crewCount) mission.crewCount = parseInt(crewCount);
    if (departureTime) {
      mission.departureTime = departureTime;
      const returnTime = new Date(departureTime);
      returnTime.setDate(returnTime.getDate() + mission.route.travelTime.days);
      mission.returnTime = returnTime.toISOString();
    }
    if (description) mission.description = description;
    if (status) mission.status = status;

    mission.updatedAt = new Date().toISOString();

    // Recalculate risk assessment if mission parameters changed
    if (name || destinationId || rocketId || crewCount) {
      const riskAssessment = aiService.assessMissionRisk(mission, global.passengers || []);
      mission.riskAssessment = riskAssessment;
    }

    // If mission status changed to ACTIVE, start real-time monitoring
    if (status === 'ACTIVE' && mission.status !== 'ACTIVE') {
      startMissionMonitoring(mission);
    }

    global.missions[missionIndex] = mission;

    // Emit real-time update
    if (global.io) {
      global.io.emit('missionUpdated', mission);
    }

    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: 'Error updating mission', error: error.message });
  }
});

// Delete mission
router.delete('/:id', (req, res) => {
  try {
    const missionIndex = global.missions.findIndex(m => m.id === req.params.id);
    if (missionIndex === -1) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    const deletedMission = global.missions.splice(missionIndex, 1)[0];

    // Emit real-time update
    if (global.io) {
      global.io.emit('missionDeleted', deletedMission);
    }

    res.json({ message: 'Mission deleted successfully', mission: deletedMission });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting mission', error: error.message });
  }
});

// Add passenger to mission
router.post('/:id/passengers', (req, res) => {
  try {
    const { passengerId } = req.body;
    const mission = global.missions.find(m => m.id === req.params.id);
    
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    const passenger = global.passengers.find(p => p.id === passengerId);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    // Check if passenger is already assigned
    if (mission.passengers.includes(passengerId)) {
      return res.status(400).json({ message: 'Passenger already assigned to mission' });
    }

    // Check crew capacity
    if (mission.passengers.length >= mission.crewCount) {
      return res.status(400).json({ message: 'Mission crew capacity reached' });
    }

    // Check passenger health eligibility
    if (passenger.healthAssessment && !passenger.healthAssessment.missionEligible) {
      return res.status(400).json({
        message: 'Passenger is not eligible for mission due to critical health issues',
        healthIssues: passenger.healthAssessment.criticalIssues.map(issue => issue.name)
      });
    }

    mission.passengers.push(passengerId);
    mission.updatedAt = new Date().toISOString();

    // Recalculate risk assessment with new passenger
    const riskAssessment = aiService.assessMissionRisk(mission, global.passengers || []);
    mission.riskAssessment = riskAssessment;

    // Emit real-time update
    if (global.io) {
      global.io.emit('missionUpdated', mission);
    }

    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: 'Error adding passenger to mission', error: error.message });
  }
});

// Remove passenger from mission
router.delete('/:id/passengers/:passengerId', (req, res) => {
  try {
    const mission = global.missions.find(m => m.id === req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    const passengerIndex = mission.passengers.indexOf(req.params.passengerId);
    if (passengerIndex === -1) {
      return res.status(404).json({ message: 'Passenger not found in mission' });
    }

    mission.passengers.splice(passengerIndex, 1);
    mission.updatedAt = new Date().toISOString();

    // Recalculate risk assessment without the passenger
    const riskAssessment = aiService.assessMissionRisk(mission, global.passengers || []);
    mission.riskAssessment = riskAssessment;

    // Emit real-time update
    if (global.io) {
      global.io.emit('missionUpdated', mission);
    }

    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: 'Error removing passenger from mission', error: error.message });
  }
});

// Get mission risk assessment
router.get('/:id/risk-assessment', (req, res) => {
  try {
    const mission = global.missions.find(m => m.id === req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    // Calculate fresh risk assessment
    const riskAssessment = aiService.assessMissionRisk(mission, global.passengers || []);
    
    res.json(riskAssessment);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating risk assessment', error: error.message });
  }
});

// Optimize mission route
router.post('/:id/optimize-route', (req, res) => {
  try {
    const mission = global.missions.find(m => m.id === req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    if (mission.passengers.length === 0) {
      return res.status(400).json({ message: 'Cannot optimize route without passengers' });
    }

    const optimization = aiService.optimizeMissionRoute(mission, global.passengers || []);
    mission.routeOptimization = optimization;
    mission.updatedAt = new Date().toISOString();

    // Emit real-time update
    if (global.io) {
      global.io.emit('missionUpdated', mission);
    }

    res.json(optimization);
  } catch (error) {
    res.status(500).json({ message: 'Error optimizing route', error: error.message });
  }
});

// Get available destinations
router.get('/destinations/available', (req, res) => {
  try {
    const destinations = planetService.getAllDestinations();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destinations', error: error.message });
  }
});

// Search destinations
router.get('/destinations/search', (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const results = planetService.searchDestinations(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching destinations', error: error.message });
  }
});

// Get available rockets
router.get('/rockets/available', (req, res) => {
  try {
    const rockets = planetService.getAllRockets();
    res.json(rockets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rockets', error: error.message });
  }
});

// Get mission recommendations
router.get('/recommendations', (req, res) => {
  try {
    const { destinationId, crewCount } = req.query;
    if (!destinationId || !crewCount) {
      return res.status(400).json({ message: 'Destination ID and crew count required' });
    }

    const recommendations = planetService.getMissionRecommendations(destinationId, parseInt(crewCount));
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error getting recommendations', error: error.message });
  }
});

// Get mission by ID - this must come after specific routes
router.get('/:id', (req, res) => {
  try {
    const mission = global.missions.find(m => m.id === req.params.id);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }
    res.json(mission);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mission', error: error.message });
  }
});

// Real-time mission monitoring for active missions
function startMissionMonitoring(mission) {
  console.log(`Starting real-time monitoring for mission: ${mission.name}`);
  
  // Set up periodic risk assessment updates
  const monitoringInterval = setInterval(() => {
    const missionIndex = global.missions.findIndex(m => m.id === mission.id);
    if (missionIndex === -1 || global.missions[missionIndex].status !== 'ACTIVE') {
      clearInterval(monitoringInterval);
      return;
    }

    // Update mission progress
    const currentTime = new Date();
    const departureTime = new Date(mission.departureTime);
    const returnTime = new Date(mission.returnTime);
    
    let progress = 0;
    let currentPhase = 'Pre-launch';
    
    if (currentTime >= departureTime && currentTime <= returnTime) {
      const totalDuration = returnTime - departureTime;
      const elapsed = currentTime - departureTime;
      progress = Math.min(100, (elapsed / totalDuration) * 100);
      
      if (progress < 25) currentPhase = 'Outbound Journey';
      else if (progress < 75) currentPhase = 'At Destination';
      else currentPhase = 'Return Journey';
    } else if (currentTime > returnTime) {
      progress = 100;
      currentPhase = 'Completed';
    }

    // Update mission with current status
    global.missions[missionIndex].progress = progress;
    global.missions[missionIndex].currentPhase = currentPhase;
    global.missions[missionIndex].lastUpdate = currentTime.toISOString();

    // Recalculate risk assessment with current conditions
    const updatedRiskAssessment = aiService.assessMissionRisk(global.missions[missionIndex], global.passengers || []);
    global.missions[missionIndex].riskAssessment = updatedRiskAssessment;

    // Emit real-time updates
    if (global.io) {
      global.io.emit('missionProgress', {
        missionId: mission.id,
        progress,
        currentPhase,
        riskAssessment: updatedRiskAssessment,
        timestamp: currentTime.toISOString()
      });
    }

    // Retrain AI model periodically during active missions
    if (Math.random() < 0.1) { // 10% chance each update
      aiService.retrainModel(global.missions, global.passengers, global.risks || []);
    }

  }, 30000); // Update every 30 seconds

  // Store the interval reference for cleanup
  if (!global.missionMonitoring) global.missionMonitoring = {};
  global.missionMonitoring[mission.id] = monitoringInterval;
}

module.exports = router; 