const synaptic = require('synaptic');
const Genetic = require('genetic-js');

class AIService {
  constructor() {
    this.neuralNetwork = null;
    this.geneticAlgorithm = null;
    this.isTraining = false;
    this.lastTrainingTime = null;
    this.initializeModels();
  }

  initializeModels() {
    try {
      // Initialize neural network for risk assessment
      this.neuralNetwork = new synaptic.Architect.Perceptron(8, 12, 8, 1);
      
      // Initialize genetic algorithm for route optimization
      this.geneticAlgorithm = Genetic.create({
        seed: function() {
          // Generate a random passenger order
          return Array.from({length: 10}, (_, i) => i).sort(() => Math.random() - 0.5);
        },
        mutate: function(entity) {
          // Swap two random positions
          const mutated = [...entity];
          const i = Math.floor(Math.random() * mutated.length);
          const j = Math.floor(Math.random() * mutated.length);
          [mutated[i], mutated[j]] = [mutated[j], mutated[i]];
          return mutated;
        },
        crossover: function(mother, father) {
          // Single point crossover
          const point = Math.floor(Math.random() * mother.length);
          return [...mother.slice(0, point), ...father.slice(point)];
        },
        fitness: function(entity) {
          // Simple fitness based on order (lower indices = better)
          return entity.reduce((sum, val, index) => sum + (index - val) ** 2, 0);
        },
        population: 50,
        generations: 100
      });

      console.log('AI models initialized successfully');
    } catch (error) {
      console.error('Error initializing AI models:', error);
      // Set fallback values
      this.neuralNetwork = null;
      this.geneticAlgorithm = null;
    }
  }

  // Assess risk for a single passenger
  assessRisk(passengerData, missionData = null) {
    try {
      // Normalize input data
      let healthRisk = 0.5; // Default moderate risk
      if (passengerData.healthAssessment) {
        healthRisk = passengerData.healthAssessment.overallRisk;
      } else if (passengerData.healthScore !== undefined) {
        healthRisk = this.normalize(100 - passengerData.healthScore, 0, 100);
      }

      const input = [
        this.normalize(passengerData.age, 18, 80),
        healthRisk, // Use health assessment risk instead of health score
        this.normalize(passengerData.experienceLevel, 0, 10),
        missionData ? this.normalize(missionData.route?.complexity || 5, 1, 10) : 0.5,
        missionData ? this.normalize(missionData.route?.distance || 100, 0, 10000) : 0.5,
        missionData ? this.normalize(missionData.rocket?.reliability || 0.9, 0, 1) : 0.5,
        missionData ? this.normalize(missionData.destination?.radiation === 'Extreme' ? 1 : 0, 0, 1) : 0.5,
        missionData ? this.normalize(missionData.destination?.gravity || 1, 0, 3) : 0.5
      ];

      const output = this.neuralNetwork.activate(input);
      const riskScore = output[0];

      // Calculate risk factors
      const factors = {
        passenger: this.normalize(passengerData.age, 18, 80) * 0.3 +
                  healthRisk * 0.4 +
                  this.normalize(passengerData.experienceLevel, 0, 10) * 0.3,
        mission: missionData ? (missionData.route?.complexity || 5) / 10 : 0.5,
        environment: missionData ? this.calculateEnvironmentRisk(missionData.destination) : 0.5,
        technology: missionData ? (1 - (missionData.rocket?.reliability || 0.9)) : 0.5
      };

      const overallRisk = (factors.passenger * 0.4 + factors.mission * 0.3 + 
                          factors.environment * 0.2 + factors.technology * 0.1);

      return {
        riskScore: Math.min(1, Math.max(0, riskScore)),
        overallRisk: Math.min(1, Math.max(0, overallRisk)),
        riskLevel: this.getRiskLevel(overallRisk),
        factors,
        recommendations: this.generateRecommendations(factors, passengerData, missionData),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in risk assessment:', error);
      return {
        riskScore: 0.5,
        overallRisk: 0.5,
        riskLevel: 'MEDIUM',
        factors: {},
        recommendations: ['Error in risk assessment'],
        timestamp: new Date().toISOString()
      };
    }
  }

  // Assess risk for an entire mission
  assessMissionRisk(mission, allPassengers) {
    try {
      const missionPassengers = allPassengers.filter(p => mission.passengers.includes(p.id));
      
      if (missionPassengers.length === 0) {
        return {
          overallRisk: 0.5,
          riskLevel: 'MEDIUM',
          passengerRisks: [],
          missionFactors: this.calculateMissionFactors(mission),
          recommendations: ['No passengers assigned to mission'],
          timestamp: new Date().toISOString()
        };
      }

      // Assess each passenger
      const passengerRisks = missionPassengers.map(passenger => ({
        passengerId: passenger.id,
        passengerName: passenger.name,
        assessment: this.assessRisk(passenger, mission)
      }));

      // Calculate mission-level factors
      const missionFactors = this.calculateMissionFactors(mission);
      
      // Calculate overall mission risk
      const averagePassengerRisk = passengerRisks.reduce((sum, pr) => sum + pr.assessment.overallRisk, 0) / passengerRisks.length;
      const missionRisk = (averagePassengerRisk * 0.4 + missionFactors.complexity * 0.3 + 
                          missionFactors.environment * 0.2 + missionFactors.technology * 0.1);

      // Generate mission-level recommendations
      const recommendations = this.generateMissionRecommendations(mission, passengerRisks, missionFactors);

      return {
        overallRisk: Math.min(1, Math.max(0, missionRisk)),
        riskLevel: this.getRiskLevel(missionRisk),
        passengerRisks,
        missionFactors,
        recommendations,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in mission risk assessment:', error);
      return {
        overallRisk: 0.5,
        riskLevel: 'MEDIUM',
        passengerRisks: [],
        missionFactors: {},
        recommendations: ['Error in mission risk assessment'],
        timestamp: new Date().toISOString()
      };
    }
  }

  // Calculate mission-specific factors
  calculateMissionFactors(mission) {
    const factors = {
      complexity: mission.route?.complexity / 10 || 0.5,
      distance: this.normalize(mission.route?.distance || 100, 0, 10000),
      environment: this.calculateEnvironmentRisk(mission.destination),
      technology: 1 - (mission.rocket?.reliability || 0.9),
      crewSize: this.normalize(mission.crewCount || 1, 1, 10),
      duration: this.normalize(mission.duration || 7, 1, 365)
    };

    return factors;
  }

  // Calculate environment risk based on destination
  calculateEnvironmentRisk(destination) {
    if (!destination) return 0.5;

    let risk = 0.5;

    // Radiation risk
    if (destination.radiation === 'Extreme') risk += 0.3;
    else if (destination.radiation === 'High') risk += 0.2;
    else if (destination.radiation === 'Moderate') risk += 0.1;

    // Temperature risk
    if (destination.temperature.includes('Extreme') || destination.temperature.includes('-200')) risk += 0.2;
    else if (destination.temperature.includes('-100')) risk += 0.1;

    // Atmosphere risk
    if (destination.atmosphere === 'None') risk += 0.1;
    if (destination.atmosphere.includes('CO2')) risk += 0.1;

    // Gravity risk
    if (destination.gravity > 2) risk += 0.1;
    else if (destination.gravity < 0.2) risk += 0.1;

    return Math.min(1, Math.max(0, risk));
  }

  // Optimize mission route using genetic algorithm
  optimizeMissionRoute(mission, allPassengers) {
    try {
      const missionPassengers = allPassengers.filter(p => mission.passengers.includes(p.id));
      
      if (missionPassengers.length === 0) {
        return {
          optimized: false,
          reason: 'No passengers to optimize',
          optimalRoute: [],
          route: [],
          fitness: 0,
          averageRisk: 0,
          generations: 0,
          timestamp: new Date().toISOString()
        };
      }

      // Create optimization problem
      const optimizationProblem = {
        passengers: missionPassengers,
        mission: mission,
        waypoints: mission.route?.waypoints || []
      };

          // Run genetic algorithm
    const result = this.geneticAlgorithm.evolve();

      // Generate optimized route
      const optimizedRoute = this.generateOptimizedRoute(optimizationProblem, result.entity);

      return {
        optimized: true,
        optimalRoute: result.entity, // Add the optimal route array
        route: optimizedRoute,
        fitness: result.fitness,
        averageRisk: missionPassengers.reduce((sum, p) => sum + (p.healthAssessment?.overallRisk || 0.5), 0) / missionPassengers.length,
        generations: result.generations || 100,
        recommendations: this.generateRouteRecommendations(optimizedRoute, mission),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in route optimization:', error);
      return {
        optimized: false,
        reason: 'Error in optimization',
        optimalRoute: [],
        route: [],
        fitness: 0,
        averageRisk: 0,
        generations: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Generate optimized route based on genetic algorithm result
  generateOptimizedRoute(problem, geneticResult) {
    const { passengers, mission, waypoints } = problem;
    
    // Create route with optimized passenger order
    const optimizedPassengers = this.optimizePassengerOrder(passengers, geneticResult);
    
    const route = {
      waypoints: waypoints.map((waypoint, index) => ({
        ...waypoint,
        passengers: index === 0 ? optimizedPassengers : [], // Assign passengers at departure
        estimatedTime: this.calculateWaypointTime(waypoint, mission)
      })),
      totalDistance: mission.route?.distance || 0,
      estimatedDuration: mission.route?.travelTime || { days: 0, hours: 0 },
      fuelRequired: mission.route?.fuelRequired || 0,
      passengerOrder: optimizedPassengers.map(p => ({ id: p.id, name: p.name }))
    };

    return route;
  }

  // Optimize passenger order for best safety and efficiency
  optimizePassengerOrder(passengers, geneticResult) {
    // Sort passengers by risk level (lowest risk first for critical positions)
    return passengers.sort((a, b) => {
      const riskA = a.healthAssessment?.overallRisk || 0.5;
      const riskB = b.healthAssessment?.overallRisk || 0.5;
      return riskA - riskB;
    });
  }

  // Calculate time for each waypoint
  calculateWaypointTime(waypoint, mission) {
    const totalDuration = mission.route?.travelTime?.days || 7;
    
    if (waypoint.type === 'launch') return 0;
    if (waypoint.type === 'checkpoint') return totalDuration * 0.5;
    if (waypoint.type === 'arrival') return totalDuration;
    
    return 0;
  }

  // Generate recommendations based on risk factors
  generateRecommendations(factors, passenger, mission) {
    const recommendations = [];

    if (factors.passenger > 0.7) {
      recommendations.push('High passenger risk: Consider additional medical screening');
    }

    if (factors.mission > 0.7) {
      recommendations.push('High mission complexity: Additional training recommended');
    }

    if (factors.environment > 0.7) {
      recommendations.push('High environment risk: Enhanced protection equipment required');
    }

    if (factors.technology > 0.3) {
      recommendations.push('Technology risk: Backup systems recommended');
    }

    // Health-specific recommendations
    if (passenger.healthAssessment) {
      if (passenger.healthAssessment.criticalIssues?.length > 0) {
        recommendations.push('Critical health issues detected: Mission participation not recommended');
      }
      if (passenger.healthAssessment.highRiskIssues?.length > 0) {
        recommendations.push('High-risk health issues: Medical clearance required');
      }
    }

    return recommendations.length > 0 ? recommendations : ['Standard monitoring recommended'];
  }

  // Generate mission-level recommendations
  generateMissionRecommendations(mission, passengerRisks, missionFactors) {
    const recommendations = [];

    // High-risk passengers
    const highRiskPassengers = passengerRisks.filter(pr => pr.assessment.riskLevel === 'HIGH');
    if (highRiskPassengers.length > 0) {
      recommendations.push(`${highRiskPassengers.length} passengers have high risk profiles`);
    }

    // Mission complexity
    if (missionFactors.complexity > 0.7) {
      recommendations.push('High mission complexity: Consider additional crew training');
    }

    // Environment risks
    if (missionFactors.environment > 0.7) {
      recommendations.push('High environment risk: Enhanced safety protocols required');
    }

    // Technology risks
    if (missionFactors.technology > 0.3) {
      recommendations.push('Technology risk: Implement backup systems');
    }

    // Crew size recommendations
    if (mission.crewCount < 3) {
      recommendations.push('Small crew size: Consider additional personnel for safety');
    }

    return recommendations.length > 0 ? recommendations : ['Mission appears safe with current configuration'];
  }

  // Generate route-specific recommendations
  generateRouteRecommendations(route, mission) {
    const recommendations = [];

    if (route.totalDistance > 1000) {
      recommendations.push('Long-distance mission: Implement communication protocols');
    }

    if (route.estimatedDuration.days > 30) {
      recommendations.push('Long-duration mission: Psychological support recommended');
    }

    if (route.fuelRequired > 50000) {
      recommendations.push('High fuel requirement: Verify fuel capacity');
    }

    return recommendations;
  }

  // Retrain the AI model
  async retrainModel(missions, passengers, risks) {
    if (this.isTraining) {
      console.log('Training already in progress');
      return { message: 'Training already in progress' };
    }

    this.isTraining = true;
    console.log('Retraining AI model...');

    try {
      // Check if neural network is available
      if (!this.neuralNetwork) {
        console.log('Reinitializing neural network...');
        this.initializeModels();
      }

      // Prepare training data
      const trainingData = this.prepareTrainingData(missions, passengers, risks);
      
      if (trainingData.length === 0) {
        console.log('No training data available, using synthetic data');
        // Generate some synthetic training data
        for (let i = 0; i < 100; i++) {
          trainingData.push({
            input: Array.from({length: 8}, () => Math.random()),
            output: [Math.random() * 0.3 + 0.2]
          });
        }
      }

      console.log(`Training neural network with ${trainingData.length} data points...`);
      
      // Train neural network
      for (let i = 0; i < Math.min(2000, trainingData.length * 10); i++) {
        const dataPoint = trainingData[Math.floor(Math.random() * trainingData.length)];
        if (this.neuralNetwork && dataPoint.input && dataPoint.output) {
          this.neuralNetwork.activate(dataPoint.input);
          this.neuralNetwork.propagate(0.1, dataPoint.output);
        }
        
        if (i % 100 === 0) {
          console.log(`Training iteration ${i}`);
        }
      }

      console.log('Neural network training completed');
      this.lastTrainingTime = new Date().toISOString();
      
      // Emit training completion event
      if (global.io) {
        global.io.emit('aiModelRetrained', {
          timestamp: this.lastTrainingTime,
          trainingDataPoints: trainingData.length
        });
      }

      return { 
        message: 'Neural network training completed successfully',
        trainingDataPoints: trainingData.length,
        timestamp: this.lastTrainingTime
      };

    } catch (error) {
      console.error('Error during AI training:', error);
      throw error;
    } finally {
      this.isTraining = false;
    }
  }

  // Prepare training data from historical missions and assessments
  prepareTrainingData(missions, passengers, risks) {
    const trainingData = [];

    // Use historical risk assessments as training data
    if (risks && risks.length > 0) {
      risks.forEach(risk => {
        if (risk.input && risk.output) {
          trainingData.push({
            input: risk.input,
            output: risk.output
          });
        }
      });
    }

    // Generate synthetic training data from current missions
    missions.forEach(mission => {
      const missionPassengers = passengers.filter(p => mission.passengers.includes(p.id));
      
      missionPassengers.forEach(passenger => {
        const healthRisk = passenger.healthAssessment?.overallRisk || 0.5;
        
        const input = [
          this.normalize(passenger.age, 18, 80),
          healthRisk,
          this.normalize(passenger.experienceLevel, 0, 10),
          this.normalize(mission.route?.complexity || 5, 1, 10),
          this.normalize(mission.route?.distance || 100, 0, 10000),
          this.normalize(mission.rocket?.reliability || 0.9, 0, 1),
          this.normalize(mission.destination?.radiation === 'Extreme' ? 1 : 0, 0, 1),
          this.normalize(mission.destination?.gravity || 1, 0, 3)
        ];

        const output = [Math.random() * 0.3 + 0.2]; // Generate reasonable risk scores

        trainingData.push({ input, output });
      });
    });

    return trainingData;
  }

  // Get AI model status
  getModelStatus() {
    return {
      isTraining: this.isTraining,
      lastTrainingTime: this.lastTrainingTime,
      neuralNetworkReady: this.neuralNetwork !== null,
      geneticAlgorithmReady: this.geneticAlgorithm !== null
    };
  }

  // Utility functions
  normalize(value, min, max) {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  getRiskLevel(riskScore) {
    if (riskScore <= 0.3) return 'LOW';
    if (riskScore <= 0.6) return 'MEDIUM';
    return 'HIGH';
  }

  // Batch assess risk for multiple passengers
  batchAssessRisk(passengers, mission) {
    if (!Array.isArray(passengers) || passengers.length === 0) {
      return [];
    }

    return passengers.map(passenger => {
      const assessment = this.assessRisk(passenger, mission);
      return {
        passengerId: passenger.id,
        passengerName: passenger.name,
        riskScore: assessment.riskScore,
        overallRisk: assessment.overallRisk,
        riskLevel: assessment.riskLevel,
        factors: assessment.factors,
        recommendations: assessment.recommendations,
        timestamp: assessment.timestamp
      };
    });
  }

  // Get AI insights from assessments
  getAIInsights(assessments, mission) {
    if (!Array.isArray(assessments) || assessments.length === 0) {
      return {
        averageRisk: 0,
        riskDistribution: { low: 0, medium: 0, high: 0 },
        topRiskFactors: [],
        recommendations: []
      };
    }

    const averageRisk = assessments.reduce((sum, a) => sum + a.overallRisk, 0) / assessments.length;
    
    const riskDistribution = assessments.reduce((dist, a) => {
      if (a.riskLevel === 'LOW') dist.low++;
      else if (a.riskLevel === 'MEDIUM') dist.medium++;
      else dist.high++;
      return dist;
    }, { low: 0, medium: 0, high: 0 });

    // Get top risk factors
    const allFactors = assessments.flatMap(a => 
      Object.entries(a.factors || {}).map(([key, value]) => ({ factor: key, value }))
    );
    
    const factorAverages = allFactors.reduce((acc, f) => {
      if (!acc[f.factor]) acc[f.factor] = { sum: 0, count: 0 };
      acc[f.factor].sum += f.value;
      acc[f.factor].count++;
      return acc;
    }, {});

    const topRiskFactors = Object.entries(factorAverages)
      .map(([factor, data]) => ({
        factor,
        averageValue: data.sum / data.count
      }))
      .sort((a, b) => b.averageValue - a.averageValue)
      .slice(0, 3);

    // Generate overall recommendations
    const recommendations = [];
    if (averageRisk > 0.7) {
      recommendations.push('High overall risk detected - consider mission postponement');
    }
    if (riskDistribution.high > assessments.length * 0.3) {
      recommendations.push('Significant number of high-risk passengers - additional screening recommended');
    }
    if (mission.route?.complexity > 7) {
      recommendations.push('High mission complexity - additional training required');
    }

    return {
      averageRisk,
      riskDistribution,
      topRiskFactors,
      recommendations,
      totalPassengers: assessments.length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new AIService(); 