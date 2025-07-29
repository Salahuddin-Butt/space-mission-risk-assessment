const rockets = [
  {
    id: 'falcon9',
    name: 'SpaceX Falcon 9',
    manufacturer: 'SpaceX',
    type: 'Reusable Rocket',
    height: 70, // meters
    diameter: 3.7, // meters
    mass: 549054, // kg
    payloadCapacity: {
      LEO: 22800, // kg to Low Earth Orbit
      GTO: 8300,  // kg to Geostationary Transfer Orbit
      Mars: 4020, // kg to Mars
      Moon: 16000  // kg to Moon
    },
    fuelCapacity: {
      RP1: 123500, // kg of RP-1 (Rocket Propellant 1)
      LOX: 287400, // kg of Liquid Oxygen
      total: 410900 // kg total propellant
    },
    engines: {
      firstStage: 9,
      secondStage: 1,
      type: 'Merlin 1D'
    },
    cost: {
      launch: 67000000, // USD
      perKg: 2939 // USD per kg to LEO
    },
    reliability: 0.98, // 98% success rate
    maxDistance: 400000000, // km (Mars distance)
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Falcon_9_rocket_with_the_Crew_Dragon_spacecraft_at_Launch_Complex_39A.jpg/1200px-Falcon_9_rocket_with_the_Crew_Dragon_spacecraft_at_Launch_Complex_39A.jpg'
  },
  {
    id: 'falcon-heavy',
    name: 'SpaceX Falcon Heavy',
    manufacturer: 'SpaceX',
    type: 'Super Heavy Lift',
    height: 70,
    diameter: 3.7,
    mass: 1420788,
    payloadCapacity: {
      LEO: 63800,
      GTO: 26700,
      Mars: 16800,
      Moon: 37000
    },
    fuelCapacity: {
      RP1: 395700,
      LOX: 922300,
      total: 1318000
    },
    engines: {
      firstStage: 27,
      secondStage: 1,
      type: 'Merlin 1D'
    },
    cost: {
      launch: 97000000,
      perKg: 1520
    },
    reliability: 0.95,
    maxDistance: 400000000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Falcon_Heavy_rocket_on_launch_pad.jpg/1200px-Falcon_Heavy_rocket_on_launch_pad.jpg'
  },
  {
    id: 'starship',
    name: 'SpaceX Starship',
    manufacturer: 'SpaceX',
    type: 'Super Heavy Lift + Interplanetary',
    height: 120,
    diameter: 9,
    mass: 5000000,
    payloadCapacity: {
      LEO: 150000,
      GTO: 21000,
      Mars: 100000,
      Moon: 100000
    },
    fuelCapacity: {
      CH4: 1200000, // Methane
      LOX: 3600000, // Liquid Oxygen
      total: 4800000
    },
    engines: {
      firstStage: 33,
      secondStage: 6,
      type: 'Raptor'
    },
    cost: {
      launch: 10000000, // Estimated future cost
      perKg: 67
    },
    reliability: 0.85, // Still in development
    maxDistance: 225000000, // km (Mars distance)
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Starship_SN8_launch.jpg/1200px-Starship_SN8_launch.jpg'
  },
  {
    id: 'sls',
    name: 'NASA SLS Block 1',
    manufacturer: 'NASA/Boeing',
    type: 'Super Heavy Lift',
    height: 98,
    diameter: 8.4,
    mass: 2608000,
    payloadCapacity: {
      LEO: 95000,
      GTO: 27000,
      Mars: 45000,
      Moon: 95000
    },
    fuelCapacity: {
      LH2: 2070000, // Liquid Hydrogen
      LOX: 2070000, // Liquid Oxygen
      total: 4140000
    },
    engines: {
      firstStage: 4,
      secondStage: 1,
      type: 'RS-25'
    },
    cost: {
      launch: 4100000000,
      perKg: 43158
    },
    reliability: 0.90,
    maxDistance: 400000000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/NASA_SLS_rocket.jpg/1200px-NASA_SLS_rocket.jpg'
  },
  {
    id: 'new-glenn',
    name: 'Blue Origin New Glenn',
    manufacturer: 'Blue Origin',
    type: 'Heavy Lift',
    height: 95,
    diameter: 7,
    mass: 1450000,
    payloadCapacity: {
      LEO: 45000,
      GTO: 13000,
      Mars: 14000,
      Moon: 45000
    },
    fuelCapacity: {
      CH4: 1000000,
      LOX: 3000000,
      total: 4000000
    },
    engines: {
      firstStage: 7,
      secondStage: 2,
      type: 'BE-4'
    },
    cost: {
      launch: 100000000,
      perKg: 2222
    },
    reliability: 0.92,
    maxDistance: 400000000,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/New_Glenn_rocket.jpg/1200px-New_Glenn_rocket.jpg'
  },
  {
    id: 'electron',
    name: 'Rocket Lab Electron',
    manufacturer: 'Rocket Lab',
    type: 'Small Satellite',
    height: 18,
    diameter: 1.2,
    mass: 12500,
    payloadCapacity: {
      LEO: 300,
      GTO: 200,
      Mars: 50,
      Moon: 150
    },
    fuelCapacity: {
      RP1: 9500,
      LOX: 9500,
      total: 19000
    },
    engines: {
      firstStage: 9,
      secondStage: 1,
      type: 'Rutherford'
    },
    cost: {
      launch: 7000000,
      perKg: 23333
    },
    reliability: 0.94,
    maxDistance: 1000000, // Limited to Earth orbit
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Electron_rocket.jpg/1200px-Electron_rocket.jpg'
  }
];

class RocketService {
  constructor() {
    this.rockets = rockets;
  }

  // Get all rockets
  getAllRockets() {
    return this.rockets;
  }

  // Get rocket by ID
  getRocketById(id) {
    return this.rockets.find(rocket => rocket.id === id);
  }

  // Calculate fuel consumption for a mission
  calculateFuelConsumption(rocketId, distance, payload) {
    const rocket = this.getRocketById(rocketId);
    if (!rocket) {
      throw new Error('Rocket not found');
    }

    // Basic fuel calculation based on distance and payload
    const baseConsumption = rocket.fuelCapacity.total;
    const distanceFactor = distance / 400000000; // Normalize to Mars distance
    const payloadFactor = payload / rocket.payloadCapacity.LEO;
    
    const fuelNeeded = baseConsumption * distanceFactor * (1 + payloadFactor * 0.5);
    
    return {
      rocketId,
      rocketName: rocket.name,
      distance,
      payload,
      fuelNeeded: Math.round(fuelNeeded),
      fuelCapacity: rocket.fuelCapacity.total,
      canCompleteMission: fuelNeeded <= rocket.fuelCapacity.total,
      efficiency: Math.round((fuelNeeded / rocket.fuelCapacity.total) * 100)
    };
  }

  // Get rockets suitable for a mission
  getSuitableRockets(distance, payload) {
    return this.rockets.filter(rocket => {
      const fuelCalc = this.calculateFuelConsumption(rocket.id, distance, payload);
      return fuelCalc.canCompleteMission && distance <= rocket.maxDistance;
    }).map(rocket => ({
      ...rocket,
      fuelAnalysis: this.calculateFuelConsumption(rocket.id, distance, payload)
    }));
  }

  // Calculate mission cost
  calculateMissionCost(rocketId, distance, payload) {
    const rocket = this.getRocketById(rocketId);
    if (!rocket) {
      throw new Error('Rocket not found');
    }

    const fuelCalc = this.calculateFuelConsumption(rocketId, distance, payload);
    const fuelCost = fuelCalc.fuelNeeded * 0.001; // $1 per kg of fuel (simplified)
    const totalCost = rocket.cost.launch + fuelCost;

    return {
      rocketId,
      rocketName: rocket.name,
      launchCost: rocket.cost.launch,
      fuelCost,
      totalCost: Math.round(totalCost),
      costPerKg: Math.round(totalCost / payload)
    };
  }

  // Get rocket statistics
  getRocketStats() {
    const stats = {
      totalRockets: this.rockets.length,
      manufacturers: [...new Set(this.rockets.map(r => r.manufacturer))],
      averageReliability: this.rockets.reduce((sum, r) => sum + r.reliability, 0) / this.rockets.length,
      averageCost: this.rockets.reduce((sum, r) => sum + r.cost.launch, 0) / this.rockets.length,
      maxPayload: Math.max(...this.rockets.map(r => r.payloadCapacity.LEO)),
      minPayload: Math.min(...this.rockets.map(r => r.payloadCapacity.LEO))
    };

    return stats;
  }
}

module.exports = new RocketService(); 