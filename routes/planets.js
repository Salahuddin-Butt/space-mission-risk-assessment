const express = require('express');
const router = express.Router();
const planetService = require('../services/planetService');
const rocketService = require('../services/rocketService');

// Get all planets
router.get('/', (req, res) => {
  try {
    const planets = planetService.getAllPlanets();
    res.json(planets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching planets', error: error.message });
  }
});

// Get planet by ID
router.get('/:id', (req, res) => {
  try {
    const planet = planetService.getPlanetById(req.params.id);
    if (!planet) {
      return res.status(404).json({ message: 'Planet not found' });
    }
    res.json(planet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching planet', error: error.message });
  }
});

// Get current distance from Earth
router.get('/:id/distance', (req, res) => {
  try {
    const distance = planetService.getCurrentDistance(req.params.id);
    const planet = planetService.getPlanetById(req.params.id);
    
    res.json({
      planetId: req.params.id,
      planetName: planet.name,
      currentDistance: distance,
      distanceRange: planet.distanceFromEarth
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating distance', error: error.message });
  }
});

// Calculate travel time for a specific rocket and planet
router.post('/:id/travel-time', (req, res) => {
  try {
    const { rocketId } = req.body;
    
    if (!rocketId) {
      return res.status(400).json({ message: 'Rocket ID is required' });
    }

    const travelTime = planetService.calculateTravelTime(req.params.id, rocketId, rocketService);
    res.json(travelTime);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating travel time', error: error.message });
  }
});

// Get mission risk factors for a planet
router.get('/:id/risk-factors', (req, res) => {
  try {
    const riskFactors = planetService.getMissionRiskFactors(req.params.id);
    res.json(riskFactors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching risk factors', error: error.message });
  }
});

// Get planets suitable for human missions
router.get('/suitable/human-missions', (req, res) => {
  try {
    const suitablePlanets = planetService.getSuitablePlanets();
    res.json(suitablePlanets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suitable planets', error: error.message });
  }
});

// Get planet statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = planetService.getPlanetStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching planet statistics', error: error.message });
  }
});

// Compare planets for mission planning
router.post('/compare', (req, res) => {
  try {
    const { planetIds, rocketId } = req.body;
    
    if (!planetIds || !Array.isArray(planetIds)) {
      return res.status(400).json({ message: 'Planet IDs array is required' });
    }

    const comparison = planetIds.map(planetId => {
      try {
        const planet = planetService.getPlanetById(planetId);
        const riskFactors = planetService.getMissionRiskFactors(planetId);
        const currentDistance = planetService.getCurrentDistance(planetId);
        
        let travelTime = null;
        if (rocketId) {
          travelTime = planetService.calculateTravelTime(planetId, rocketId, rocketService);
        }
        
        return {
          planetId,
          planetName: planet.name,
          planetType: planet.type,
          currentDistance,
          riskFactors,
          travelTime,
          characteristics: {
            gravity: planet.characteristics.gravity,
            temperature: planet.characteristics.temperature,
            atmosphere: planet.characteristics.atmosphere,
            moons: planet.characteristics.moons
          },
          challenges: planet.missionChallenges
        };
      } catch (error) {
        return {
          planetId,
          error: error.message
        };
      }
    });

    res.json(comparison);
  } catch (error) {
    res.status(500).json({ message: 'Error comparing planets', error: error.message });
  }
});

// Get mission feasibility analysis
router.post('/:id/feasibility', (req, res) => {
  try {
    const { rocketId, passengerCount, missionDuration } = req.body;
    
    if (!rocketId || !passengerCount) {
      return res.status(400).json({ message: 'Rocket ID and passenger count are required' });
    }

    const planet = planetService.getPlanetById(req.params.id);
    const rocket = rocketService.getRocketById(rocketId);
    const riskFactors = planetService.getMissionRiskFactors(req.params.id);
    const travelTime = planetService.calculateTravelTime(req.params.id, rocketId, rocketService);
    
    // Calculate payload (passengers + equipment)
    const passengerWeight = passengerCount * 80; // Average 80kg per passenger
    const equipmentWeight = passengerCount * 200; // 200kg equipment per passenger
    const totalPayload = passengerWeight + equipmentWeight;
    
    const fuelAnalysis = rocketService.calculateFuelConsumption(rocketId, travelTime.distance, totalPayload);
    const costAnalysis = rocketService.calculateMissionCost(rocketId, travelTime.distance, totalPayload);
    
    const feasibility = {
      planetId: req.params.id,
      planetName: planet.name,
      rocketId,
      rocketName: rocket.name,
      passengerCount,
      totalPayload,
      travelTime,
      riskFactors,
      fuelAnalysis,
      costAnalysis,
      feasibility: {
        fuelFeasible: fuelAnalysis.canCompleteMission,
        payloadFeasible: totalPayload <= rocket.payloadCapacity.LEO,
        distanceFeasible: travelTime.distance <= rocket.maxDistance,
        overallFeasible: fuelAnalysis.canCompleteMission && 
                        totalPayload <= rocket.payloadCapacity.LEO && 
                        travelTime.distance <= rocket.maxDistance
      },
      recommendations: []
    };
    
    // Generate recommendations
    if (!feasibility.feasibility.fuelFeasible) {
      feasibility.recommendations.push('Insufficient fuel capacity for this mission');
    }
    if (!feasibility.feasibility.payloadFeasible) {
      feasibility.recommendations.push('Payload exceeds rocket capacity');
    }
    if (!feasibility.feasibility.distanceFeasible) {
      feasibility.recommendations.push('Distance exceeds rocket range');
    }
    if (riskFactors.overallRisk > 0.8) {
      feasibility.recommendations.push('High-risk destination - consider alternative planets');
    }
    if (travelTime.travelTimeYears > 2) {
      feasibility.recommendations.push('Very long mission duration - consider crew rotation strategy');
    }
    
    res.json(feasibility);
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing mission feasibility', error: error.message });
  }
});

module.exports = router; 