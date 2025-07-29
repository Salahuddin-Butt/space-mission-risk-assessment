# Mission Risk Assessment API Documentation

## Overview
This API provides comprehensive mission risk assessment capabilities using both neural networks and genetic algorithms, with real rocket and planet data from space agencies worldwide.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

## Endpoints

### Rockets

#### Get All Rockets
```http
GET /rockets
```
Returns all available rockets with specifications from SpaceX, NASA, Blue Origin, and Rocket Lab.

**Response:**
```json
[
  {
    "id": "falcon9",
    "name": "SpaceX Falcon 9",
    "manufacturer": "SpaceX",
    "type": "Reusable Rocket",
    "height": 70,
    "diameter": 3.7,
    "mass": 549054,
    "payloadCapacity": {
      "LEO": 22800,
      "GTO": 8300,
      "Mars": 4020,
      "Moon": 16000
    },
    "fuelCapacity": {
      "RP1": 123500,
      "LOX": 287400,
      "total": 410900
    },
    "engines": {
      "firstStage": 9,
      "secondStage": 1,
      "type": "Merlin 1D"
    },
    "cost": {
      "launch": 67000000,
      "perKg": 2939
    },
    "reliability": 0.98,
    "maxDistance": 400000000,
    "image": "https://..."
  }
]
```

#### Get Rocket by ID
```http
GET /rockets/{id}
```
Returns detailed information about a specific rocket.

#### Calculate Fuel Consumption
```http
POST /rockets/{id}/fuel-calculation
```
Calculate fuel requirements for a mission.

**Request Body:**
```json
{
  "distance": 225000000,
  "payload": 5000
}
```

**Response:**
```json
{
  "rocketId": "falcon9",
  "rocketName": "SpaceX Falcon 9",
  "distance": 225000000,
  "payload": 5000,
  "fuelNeeded": 205450,
  "fuelCapacity": 410900,
  "canCompleteMission": true,
  "efficiency": 50
}
```

#### Get Suitable Rockets
```http
POST /rockets/suitable
```
Find rockets capable of completing a specific mission.

**Request Body:**
```json
{
  "distance": 225000000,
  "payload": 5000
}
```

#### Calculate Mission Cost
```http
POST /rockets/{id}/mission-cost
```
Calculate total mission cost including fuel.

#### Compare Rockets
```http
POST /rockets/compare
```
Compare multiple rockets for a mission.

**Request Body:**
```json
{
  "rocketIds": ["falcon9", "falcon-heavy", "starship"],
  "distance": 225000000,
  "payload": 5000
}
```

### Planets

#### Get All Planets
```http
GET /planets
```
Returns all planets and celestial bodies with real astronomical data.

**Response:**
```json
[
  {
    "id": "mars",
    "name": "Mars",
    "type": "Terrestrial",
    "distanceFromEarth": {
      "min": 54600000,
      "max": 401000000,
      "average": 225000000
    },
    "characteristics": {
      "diameter": 6779,
      "mass": 6.39e23,
      "gravity": 3.71,
      "temperature": {
        "min": -140,
        "max": 20,
        "average": -63
      },
      "atmosphere": "CO2, N2, Ar",
      "surfacePressure": 610,
      "dayLength": 24.6,
      "yearLength": 687,
      "moons": 2
    },
    "missionChallenges": {
      "radiation": "HIGH",
      "temperature": "MODERATE",
      "landing": "MODERATE",
      "communication": "HIGH"
    },
    "riskFactors": {
      "solarRadiation": 0.8,
      "temperatureExtremes": 0.6,
      "landingComplexity": 0.7,
      "communicationDelay": 0.8,
      "gravityWell": 0.4
    },
    "image": "https://...",
    "description": "The most Earth-like planet..."
  }
]
```

#### Get Current Distance
```http
GET /planets/{id}/distance
```
Get current distance from Earth (calculated based on orbital positions).

#### Calculate Travel Time
```http
POST /planets/{id}/travel-time
```
Calculate travel time for a specific rocket to reach the planet.

**Request Body:**
```json
{
  "rocketId": "falcon9"
}
```

#### Get Risk Factors
```http
GET /planets/{id}/risk-factors
```
Get mission risk factors for a specific planet.

#### Get Suitable Planets
```http
GET /planets/suitable/human-missions
```
Get planets suitable for human missions (excludes gas giants).

#### Mission Feasibility Analysis
```http
POST /planets/{id}/feasibility
```
Comprehensive feasibility analysis for a mission to a specific planet.

**Request Body:**
```json
{
  "rocketId": "falcon9",
  "passengerCount": 4,
  "missionDuration": 500
}
```

### Missions

#### Create Mission
```http
POST /missions
```
Create a new mission with rocket and planet specifications.

**Request Body:**
```json
{
  "name": "Mars Colony Mission",
  "destination": "Mars",
  "distance": 225000000,
  "weatherRisk": 30,
  "duration": 500,
  "maxPassengers": 6,
  "departureTime": "2024-12-01T00:00:00.000Z",
  "description": "First human mission to Mars",
  "rocketId": "starship",
  "planetId": "mars"
}
```

#### Enhanced Risk Assessment
```http
GET /missions/{id}/risk-assessment
```
Get comprehensive risk assessment using neural network with rocket and planet data.

**Response:**
```json
{
  "missionId": "123",
  "missionName": "Mars Colony Mission",
  "rocketData": { /* rocket details */ },
  "planetData": { /* planet details */ },
  "assessments": [
    {
      "passengerId": "456",
      "riskScore": 0.45,
      "riskLevel": "MEDIUM",
      "confidence": 0.85,
      "factors": {
        "passenger": 0.6,
        "mission": 0.4,
        "rocket": 0.15,
        "planet": 0.7
      }
    }
  ],
  "insights": {
    "overallRisk": 0.45,
    "highRiskCount": 1,
    "recommendations": [
      "Consider using a more reliable rocket for this mission"
    ]
  },
  "missionMetrics": {
    "totalPayload": 1680,
    "fuelAnalysis": { /* fuel calculation */ },
    "costAnalysis": { /* cost calculation */ },
    "travelTime": { /* travel time */ },
    "planetRisk": { /* planet risk factors */ }
  }
}
```

#### Comprehensive Mission Optimization
```http
POST /missions/{id}/optimize-mission
```
Run both neural network and genetic algorithm optimization for mission planning.

**Response:**
```json
{
  "missionId": "123",
  "missionName": "Mars Colony Mission",
  "neuralNetworkAnalysis": {
    "assessments": [ /* passenger risk assessments */ ],
    "averageRisk": 0.45,
    "riskDistribution": {
      "low": 2,
      "medium": 3,
      "high": 1
    }
  },
  "geneticAlgorithmOptimization": {
    "optimalConfiguration": {
      "rocketType": 2,
      "planetType": 2,
      "passengerCount": 4,
      "missionDuration": 450,
      "safetyMargin": 0.85
    },
    "fitness": 0.78,
    "generations": 30,
    "averageFitness": 0.65,
    "recommendations": [
      "Consider reducing passenger count for lower risk",
      "Mission destination poses moderate risks"
    ]
  },
  "missionFeasibility": {
    "fuelFeasible": true,
    "payloadFeasible": true,
    "distanceFeasible": true,
    "overallFeasible": true,
    "fuelAnalysis": { /* fuel details */ },
    "costAnalysis": { /* cost details */ },
    "travelTime": { /* travel time */ }
  },
  "recommendations": [
    "Mission is feasible with current configuration",
    "Consider crew rotation strategy for long mission duration"
  ]
}
```

### Passengers

#### Get All Passengers
```http
GET /passengers
```

#### Create Passenger
```http
POST /passengers
```
**Request Body:**
```json
{
  "name": "John Doe",
  "age": 35,
  "healthScore": 85,
  "experienceLevel": 8,
  "specializations": ["pilot", "engineer"]
}
```

### Assessments

#### Get All Assessments
```http
GET /assessments
```

#### Create Assessment
```http
POST /assessments
```

## AI Features

### Neural Network
- **Inputs**: 12 parameters including passenger data, mission data, rocket specifications, and planet characteristics
- **Architecture**: 4-layer neural network (12 → 20 → 15 → 10 → 1)
- **Training**: 2000 iterations with real mission scenarios
- **Output**: Risk score (0-1) with confidence level

### Genetic Algorithm
- **Population**: 50-100 individuals
- **Generations**: 30-50 generations
- **Parameters**: Rocket type, planet type, passenger count, mission duration, safety margin
- **Fitness**: Inverse of risk score (lower risk = higher fitness)
- **Optimization**: Mission configuration optimization

## Data Sources

### Rockets
- **SpaceX**: Falcon 9, Falcon Heavy, Starship
- **NASA**: SLS Block 1
- **Blue Origin**: New Glenn
- **Rocket Lab**: Electron

### Planets
- **Terrestrial**: Mercury, Venus, Mars
- **Gas Giants**: Jupiter, Saturn
- **Ice Giants**: Uranus, Neptune
- **Natural Satellite**: Moon

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

Error responses include a message and optional error details:
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Real-time Updates

The API uses Socket.IO for real-time updates:
- Mission creation/updates
- Risk assessment changes
- Passenger assignments
- Real-time mission status

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## CORS

CORS is enabled for development. Configure appropriately for production.

## Examples

### Complete Mission Planning Workflow

1. **Get available rockets and planets:**
```bash
curl http://localhost:5000/api/rockets
curl http://localhost:5000/api/planets
```

2. **Analyze mission feasibility:**
```bash
curl -X POST http://localhost:5000/api/planets/mars/feasibility \
  -H "Content-Type: application/json" \
  -d '{"rocketId": "starship", "passengerCount": 4}'
```

3. **Create mission:**
```bash
curl -X POST http://localhost:5000/api/missions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mars Mission",
    "destination": "Mars",
    "distance": 225000000,
    "weatherRisk": 30,
    "rocketId": "starship",
    "planetId": "mars"
  }'
```

4. **Add passengers and run optimization:**
```bash
curl -X POST http://localhost:5000/api/missions/{missionId}/optimize-mission
```

This comprehensive API provides everything needed for advanced space mission planning with real data and AI-powered risk assessment. 