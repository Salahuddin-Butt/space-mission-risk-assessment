const celestialDestinations = {
  // Solar System Planets
  mercury: {
    name: "Mercury",
    distance: 77.3, // million km
    gravity: 0.38,
    atmosphere: "None",
    temperature: "Extreme (-180°C to 430°C)",
    radiation: "High",
    missionComplexity: "Very High",
    coordinates: { x: 0, y: 0, z: 0.39 },
    description: "Closest planet to the Sun, extreme temperature variations"
  },
  venus: {
    name: "Venus",
    distance: 38.2,
    gravity: 0.91,
    atmosphere: "Dense CO2",
    temperature: "460°C",
    radiation: "High",
    missionComplexity: "Very High",
    coordinates: { x: 0, y: 0, z: 0.72 },
    description: "Hottest planet, thick atmosphere, sulfuric acid clouds"
  },
  mars: {
    name: "Mars",
    distance: 54.6,
    gravity: 0.38,
    atmosphere: "Thin CO2",
    temperature: "-140°C to 20°C",
    radiation: "High",
    missionComplexity: "High",
    coordinates: { x: 0, y: 0, z: 1.52 },
    description: "Red planet, potential for human colonization"
  },
  jupiter: {
    name: "Jupiter",
    distance: 588.5,
    gravity: 2.34,
    atmosphere: "Hydrogen/Helium",
    temperature: "-110°C",
    radiation: "Extreme",
    missionComplexity: "Extreme",
    coordinates: { x: 0, y: 0, z: 5.20 },
    description: "Largest planet, gas giant with intense radiation"
  },
  saturn: {
    name: "Saturn",
    distance: 1200.0,
    gravity: 0.93,
    atmosphere: "Hydrogen/Helium",
    temperature: "-140°C",
    radiation: "High",
    missionComplexity: "Extreme",
    coordinates: { x: 0, y: 0, z: 9.58 },
    description: "Ringed planet, beautiful but challenging destination"
  },
  uranus: {
    name: "Uranus",
    distance: 2581.9,
    gravity: 0.89,
    atmosphere: "Hydrogen/Helium/Methane",
    temperature: "-195°C",
    radiation: "Moderate",
    missionComplexity: "Extreme",
    coordinates: { x: 0, y: 0, z: 19.18 },
    description: "Ice giant, tilted on its side"
  },
  neptune: {
    name: "Neptune",
    distance: 4305.9,
    gravity: 1.12,
    atmosphere: "Hydrogen/Helium/Methane",
    temperature: "-200°C",
    radiation: "Moderate",
    missionComplexity: "Extreme",
    coordinates: { x: 0, y: 0, z: 30.07 },
    description: "Farthest planet, strong winds and storms"
  },
  
  // Moons
  moon: {
    name: "Moon",
    distance: 0.384,
    gravity: 0.17,
    atmosphere: "None",
    temperature: "-173°C to 127°C",
    radiation: "High",
    missionComplexity: "Medium",
    coordinates: { x: 0, y: 0, z: 0.00257 },
    description: "Earth's natural satellite, closest celestial body"
  },
  europa: {
    name: "Europa (Jupiter's Moon)",
    distance: 588.5,
    gravity: 0.13,
    atmosphere: "Thin Oxygen",
    temperature: "-160°C",
    radiation: "Extreme",
    missionComplexity: "Very High",
    coordinates: { x: 0, y: 0, z: 5.20 },
    description: "Icy moon with potential subsurface ocean"
  },
  titan: {
    name: "Titan (Saturn's Moon)",
    distance: 1200.0,
    gravity: 0.14,
    atmosphere: "Nitrogen/Methane",
    temperature: "-179°C",
    radiation: "High",
    missionComplexity: "Very High",
    coordinates: { x: 0, y: 0, z: 9.58 },
    description: "Largest moon of Saturn, thick atmosphere"
  },
  
  // Other Destinations
  iss: {
    name: "International Space Station",
    distance: 0.000408,
    gravity: 0.0,
    atmosphere: "Controlled",
    temperature: "Controlled",
    radiation: "Moderate",
    missionComplexity: "Low",
    coordinates: { x: 0, y: 0, z: 0.000408 },
    description: "Low Earth orbit space station"
  },
  asteroid_belt: {
    name: "Asteroid Belt",
    distance: 329.0,
    gravity: 0.0,
    atmosphere: "None",
    temperature: "-73°C",
    radiation: "High",
    missionComplexity: "High",
    coordinates: { x: 0, y: 0, z: 2.2 },
    description: "Region between Mars and Jupiter with numerous asteroids"
  },
  pluto: {
    name: "Pluto",
    distance: 5900.0,
    gravity: 0.06,
    atmosphere: "Thin Nitrogen",
    temperature: "-230°C",
    radiation: "Low",
    missionComplexity: "Extreme",
    coordinates: { x: 0, y: 0, z: 39.48 },
    description: "Dwarf planet in the Kuiper Belt"
  }
};

const rocketTypes = {
  falcon_9: {
    name: "SpaceX Falcon 9",
    payloadCapacity: 22800, // kg to LEO
    maxDistance: 1000, // million km
    fuelEfficiency: 0.85,
    reliability: 0.98,
    cost: 67, // million USD
    crewCapacity: 7,
    description: "Reusable rocket, excellent for Earth orbit and lunar missions"
  },
  falcon_heavy: {
    name: "SpaceX Falcon Heavy",
    payloadCapacity: 63800,
    maxDistance: 2000,
    fuelEfficiency: 0.80,
    reliability: 0.95,
    cost: 97,
    crewCapacity: 7,
    description: "Most powerful operational rocket, suitable for Mars missions"
  },
  starship: {
    name: "SpaceX Starship",
    payloadCapacity: 100000,
    maxDistance: 10000,
    fuelEfficiency: 0.90,
    reliability: 0.85, // Still in development
    cost: 10, // per passenger
    crewCapacity: 100,
    description: "Next-generation spacecraft for interplanetary travel"
  },
  sls: {
    name: "NASA SLS",
    payloadCapacity: 95000,
    maxDistance: 5000,
    fuelEfficiency: 0.75,
    reliability: 0.90,
    cost: 2000,
    crewCapacity: 4,
    description: "NASA's heavy-lift rocket for deep space exploration"
  },
  new_glenn: {
    name: "Blue Origin New Glenn",
    payloadCapacity: 45000,
    maxDistance: 1500,
    fuelEfficiency: 0.82,
    reliability: 0.92,
    cost: 120,
    crewCapacity: 7,
    description: "Reusable rocket for orbital and lunar missions"
  },
  electron: {
    name: "Rocket Lab Electron",
    payloadCapacity: 300,
    maxDistance: 100,
    fuelEfficiency: 0.88,
    reliability: 0.96,
    cost: 7,
    crewCapacity: 0, // No crew capacity
    description: "Small satellite launcher, not suitable for crewed missions"
  }
};

class PlanetService {
  constructor() {
    this.destinations = celestialDestinations;
    this.rockets = rocketTypes;
  }

  getAllDestinations() {
    return Object.entries(this.destinations).map(([key, destination]) => ({
      id: key,
      ...destination
    }));
  }

  getAllRockets() {
    return Object.entries(this.rockets).map(([key, rocket]) => ({
      id: key,
      ...rocket
    }));
  }

  searchDestinations(query) {
    const searchTerm = query.toLowerCase();
    return this.getAllDestinations().filter(destination =>
      destination.name.toLowerCase().includes(searchTerm) ||
      destination.description.toLowerCase().includes(searchTerm)
    );
  }

  getDestination(destinationId) {
    return this.destinations[destinationId] || null;
  }

  getRocket(rocketId) {
    return this.rockets[rocketId] || null;
  }

  calculateRoute(fromDestination, toDestination) {
    const from = this.getDestination(fromDestination) || { coordinates: { x: 0, y: 0, z: 1 } }; // Default to Earth
    const to = this.getDestination(toDestination);
    
    if (!to) return null;

    // Calculate 3D distance using Euclidean distance
    const dx = to.coordinates.x - from.coordinates.x;
    const dy = to.coordinates.y - from.coordinates.y;
    const dz = to.coordinates.z - from.coordinates.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) * 149.6; // Convert AU to million km

    // Calculate travel time based on distance and rocket capabilities
    const travelTime = this.calculateTravelTime(distance);
    
    // Calculate fuel requirements
    const fuelRequired = this.calculateFuelRequirements(distance, to.gravity);
    
    // Calculate route complexity
    const complexity = this.calculateRouteComplexity(to, distance);

    return {
      from: from.name || "Earth",
      to: to.name,
      distance: distance,
      travelTime: travelTime,
      fuelRequired: fuelRequired,
      complexity: complexity,
      waypoints: this.generateWaypoints(from, to),
      risks: this.assessRouteRisks(to, distance)
    };
  }

  calculateTravelTime(distance) {
    // Simplified calculation based on distance
    // Real calculations would consider rocket type, fuel, and orbital mechanics
    if (distance < 1) return { days: 1, hours: 12 }; // LEO
    if (distance < 10) return { days: 3, hours: 0 }; // Moon
    if (distance < 100) return { days: 7, hours: 0 }; // Mars
    if (distance < 1000) return { days: 30, hours: 0 }; // Jupiter
    return { days: 365, hours: 0 }; // Outer planets
  }

  calculateFuelRequirements(distance, destinationGravity) {
    // Simplified fuel calculation
    const baseFuel = distance * 1000; // kg
    const gravityFactor = 1 + (destinationGravity * 0.5);
    return Math.round(baseFuel * gravityFactor);
  }

  calculateRouteComplexity(destination, distance) {
    let complexity = 1;
    
    // Distance factor
    complexity += distance / 100;
    
    // Destination factors
    if (destination.radiation === "Extreme") complexity += 2;
    if (destination.radiation === "High") complexity += 1;
    
    if (destination.atmosphere === "None") complexity += 0.5;
    if (destination.atmosphere.includes("CO2")) complexity += 1;
    
    if (destination.temperature.includes("Extreme")) complexity += 1;
    if (destination.temperature.includes("-200")) complexity += 1;
    
    return Math.min(10, Math.max(1, complexity));
  }

  generateWaypoints(from, to) {
    const waypoints = [];
    
    // Add Earth departure
    waypoints.push({
      name: "Earth Departure",
      distance: 0,
      type: "launch"
    });
    
    // Add intermediate points for long journeys
    const totalDistance = Math.sqrt(
      Math.pow(to.coordinates.x - from.coordinates.x, 2) +
      Math.pow(to.coordinates.y - from.coordinates.y, 2) +
      Math.pow(to.coordinates.z - from.coordinates.z, 2)
    ) * 149.6;
    
    if (totalDistance > 100) {
      waypoints.push({
        name: "Deep Space Checkpoint",
        distance: totalDistance * 0.5,
        type: "checkpoint"
      });
    }
    
    // Add destination arrival
    waypoints.push({
      name: `${to.name} Arrival`,
      distance: totalDistance,
      type: "arrival"
    });
    
    return waypoints;
  }

  assessRouteRisks(destination, distance) {
    const risks = [];
    
    // Distance risks
    if (distance > 1000) {
      risks.push({
        type: "Communication Delay",
        severity: "High",
        description: "Significant delay in Earth communication"
      });
    }
    
    // Radiation risks
    if (destination.radiation === "Extreme") {
      risks.push({
        type: "Radiation Exposure",
        severity: "Critical",
        description: "Extreme radiation levels require special protection"
      });
    }
    
    // Temperature risks
    if (destination.temperature.includes("Extreme") || destination.temperature.includes("-200")) {
      risks.push({
        type: "Temperature Extremes",
        severity: "High",
        description: "Extreme temperature variations require advanced thermal protection"
      });
    }
    
    // Gravity risks
    if (destination.gravity > 2) {
      risks.push({
        type: "High Gravity",
        severity: "Medium",
        description: "High gravity environment affects landing and operations"
      });
    }
    
    return risks;
  }

  validateRocketForMission(rocketId, destinationId, crewCount) {
    const rocket = this.getRocket(rocketId);
    const destination = this.getDestination(destinationId);
    
    if (!rocket || !destination) return { valid: false, reason: "Invalid rocket or destination" };
    
    const route = this.calculateRoute("earth", destinationId);
    
    // Check payload capacity
    if (crewCount * 100 > rocket.payloadCapacity) {
      return { valid: false, reason: "Rocket payload capacity insufficient for crew" };
    }
    
    // Check distance capability
    if (route.distance > rocket.maxDistance) {
      return { valid: false, reason: "Rocket cannot reach destination" };
    }
    
    // Check crew capacity
    if (crewCount > rocket.crewCapacity) {
      return { valid: false, reason: "Rocket crew capacity exceeded" };
    }
    
    return { valid: true, rocket, destination, route };
  }

  getMissionRecommendations(destinationId, crewCount) {
    const destination = this.getDestination(destinationId);
    if (!destination) return [];
    
    const recommendations = [];
    
    // Rocket recommendations based on destination
    const suitableRockets = this.getAllRockets().filter(rocket => {
      const validation = this.validateRocketForMission(rocket.id, destinationId, crewCount);
      return validation.valid;
    });
    
    recommendations.push({
      type: "rocket",
      title: "Recommended Rockets",
      items: suitableRockets.slice(0, 3).map(rocket => ({
        name: rocket.name,
        reason: rocket.description
      }))
    });
    
    // Safety recommendations
    if (destination.radiation === "Extreme") {
      recommendations.push({
        type: "safety",
        title: "Radiation Protection Required",
        items: [
          { name: "Enhanced Shielding", reason: "Protect against extreme radiation" },
          { name: "Radiation Monitoring", reason: "Continuous monitoring of exposure levels" }
        ]
      });
    }
    
    // Mission duration recommendations
    const route = this.calculateRoute("earth", destinationId);
    if (route.travelTime.days > 30) {
      recommendations.push({
        type: "logistics",
        title: "Long Duration Mission",
        items: [
          { name: "Extended Life Support", reason: "Sufficient supplies for long journey" },
          { name: "Psychological Support", reason: "Mental health considerations for crew" }
        ]
      });
    }
    
    return recommendations;
  }
}

module.exports = new PlanetService(); 