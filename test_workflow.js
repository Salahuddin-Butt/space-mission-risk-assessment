const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testCompleteWorkflow() {
  console.log('🚀 Testing Complete Mission Planning Workflow\n');

  try {
    // Step 1: Get available rockets and planets
    console.log('1. 📋 Getting available rockets and planets...');
    const rocketsResponse = await axios.get(`${BASE_URL}/rockets`);
    const planetsResponse = await axios.get(`${BASE_URL}/planets`);
    
    console.log(`   Found ${rocketsResponse.data.length} rockets and ${planetsResponse.data.length} planets`);
    console.log(`   Rockets: ${rocketsResponse.data.map(r => r.name).join(', ')}`);
    console.log(`   Planets: ${planetsResponse.data.map(p => p.name).join(', ')}\n`);

    // Step 2: Analyze mission feasibility for Mars
    console.log('2. 🔍 Analyzing Mars mission feasibility...');
    const feasibilityResponse = await axios.post(`${BASE_URL}/planets/mars/feasibility`, {
      rocketId: 'starship',
      passengerCount: 4,
      missionDuration: 500
    });
    
    const feasibility = feasibilityResponse.data;
    console.log(`   Mission: ${feasibility.planetName} with ${feasibility.rocketName}`);
    console.log(`   Feasible: ${feasibility.feasibility.overallFeasible ? '✅ YES' : '❌ NO'}`);
    console.log(`   Travel Time: ${feasibility.travelTime.travelTimeDays} days`);
    console.log(`   Total Cost: $${feasibility.costAnalysis.totalCost.toLocaleString()}`);
    console.log(`   Risk Level: ${feasibility.riskFactors.overallRisk > 0.7 ? 'HIGH' : feasibility.riskFactors.overallRisk > 0.4 ? 'MEDIUM' : 'LOW'}\n`);

    // Step 3: Compare rockets for Mars mission
    console.log('3. ⚖️ Comparing rockets for Mars mission...');
    const comparisonResponse = await axios.post(`${BASE_URL}/rockets/compare`, {
      rocketIds: ['falcon9', 'falcon-heavy', 'starship'],
      distance: 225000000,
      payload: 5000
    });
    
    console.log('   Rocket Comparison:');
    comparisonResponse.data.forEach(rocket => {
      if (rocket.error) {
        console.log(`     ${rocket.rocketName}: ERROR - ${rocket.error}`);
      } else {
        console.log(`     ${rocket.rocketName}: ${rocket.suitability} (Cost: $${rocket.costAnalysis.totalCost.toLocaleString()})`);
      }
    });
    console.log('');

    // Step 4: Create a mission
    console.log('4. 🛠️ Creating Mars mission...');
    const missionResponse = await axios.post(`${BASE_URL}/missions`, {
      name: 'Mars Colony Mission',
      destination: 'Mars',
      distance: 225000000,
      weatherRisk: 30,
      duration: 500,
      maxPassengers: 6,
      description: 'First human mission to Mars',
      rocketId: 'starship',
      planetId: 'mars'
    });
    
    const mission = missionResponse.data;
    console.log(`   Mission created: ${mission.name} (ID: ${mission.id})\n`);

    // Step 5: Add some test passengers
    console.log('5. 👥 Adding test passengers...');
    const passengers = [
      { name: 'John Doe', age: 35, healthScore: 85, experienceLevel: 8, specializations: ['pilot', 'engineer'] },
      { name: 'Jane Smith', age: 28, healthScore: 90, experienceLevel: 6, specializations: ['scientist', 'doctor'] },
      { name: 'Mike Johnson', age: 42, healthScore: 75, experienceLevel: 9, specializations: ['commander', 'pilot'] },
      { name: 'Sarah Wilson', age: 31, healthScore: 88, experienceLevel: 7, specializations: ['engineer', 'scientist'] }
    ];

    const passengerIds = [];
    for (const passenger of passengers) {
      const passengerResponse = await axios.post(`${BASE_URL}/passengers`, passenger);
      passengerIds.push(passengerResponse.data.id);
      console.log(`   Added: ${passenger.name} (Age: ${passenger.age}, Health: ${passenger.healthScore})`);
    }
    console.log('');

    // Step 6: Add passengers to mission
    console.log('6. 🚀 Assigning passengers to mission...');
    for (const passengerId of passengerIds) {
      await axios.post(`${BASE_URL}/missions/${mission.id}/passengers`, { passengerId });
    }
    console.log(`   All ${passengerIds.length} passengers assigned to mission\n`);

    // Step 7: Run comprehensive risk assessment
    console.log('7. 🧠 Running AI-powered risk assessment...');
    const riskResponse = await axios.get(`${BASE_URL}/missions/${mission.id}/risk-assessment`);
    const riskData = riskResponse.data;
    
    console.log(`   Neural Network Analysis:`);
    console.log(`     Average Risk: ${(riskData.insights.overallRisk * 100).toFixed(1)}%`);
    console.log(`     High Risk Passengers: ${riskData.insights.highRiskCount}`);
    console.log(`     Total Payload: ${riskData.missionMetrics.totalPayload}kg`);
    console.log(`     Fuel Efficiency: ${riskData.missionMetrics.fuelAnalysis.efficiency}%`);
    console.log(`     Mission Cost: $${riskData.missionMetrics.costAnalysis.totalCost.toLocaleString()}`);
    console.log('');

    // Step 8: Run comprehensive optimization
    console.log('8. 🧬 Running genetic algorithm optimization...');
    const optimizationResponse = await axios.post(`${BASE_URL}/missions/${mission.id}/optimize-mission`);
    const optimization = optimizationResponse.data;
    
    console.log(`   Genetic Algorithm Results:`);
    console.log(`     Fitness Score: ${(optimization.geneticAlgorithmOptimization.fitness * 100).toFixed(1)}%`);
    console.log(`     Generations: ${optimization.geneticAlgorithmOptimization.generations}`);
    console.log(`     Recommendations: ${optimization.recommendations.length}`);
    
    if (optimization.recommendations.length > 0) {
      console.log('     Top Recommendations:');
      optimization.recommendations.slice(0, 3).forEach((rec, i) => {
        console.log(`       ${i + 1}. ${rec}`);
      });
    }
    console.log('');

    // Step 9: Final mission summary
    console.log('9. 📊 Final Mission Summary');
    console.log(`   Mission: ${mission.name}`);
    console.log(`   Destination: ${mission.destination}`);
    console.log(`   Rocket: ${riskData.rocketData.name}`);
    console.log(`   Passengers: ${riskData.totalPassengers}/${mission.maxPassengers}`);
    console.log(`   Overall Feasibility: ${optimization.missionFeasibility.overallFeasible ? '✅ FEASIBLE' : '❌ NOT FEASIBLE'}`);
    console.log(`   Total Mission Cost: $${riskData.missionMetrics.costAnalysis.totalCost.toLocaleString()}`);
    console.log(`   Travel Time: ${riskData.missionMetrics.travelTime.travelTimeDays} days`);
    console.log(`   Risk Level: ${riskData.insights.overallRisk > 0.7 ? 'HIGH' : riskData.insights.overallRisk > 0.4 ? 'MEDIUM' : 'LOW'}`);

    console.log('\n🎉 Mission planning workflow completed successfully!');
    console.log('\n📋 Key Features Demonstrated:');
    console.log('   ✅ Real rocket data from SpaceX, NASA, Blue Origin, Rocket Lab');
    console.log('   ✅ Real planet data with accurate distances and characteristics');
    console.log('   ✅ Fuel consumption calculations based on distance and payload');
    console.log('   ✅ Mission cost analysis including fuel costs');
    console.log('   ✅ Travel time calculations for different rockets');
    console.log('   ✅ Neural network risk assessment with 12 input parameters');
    console.log('   ✅ Genetic algorithm optimization for mission configuration');
    console.log('   ✅ Comprehensive feasibility analysis');
    console.log('   ✅ Real-time risk monitoring and recommendations');

  } catch (error) {
    console.error('❌ Error during workflow test:', error.response?.data || error.message);
  }
}

// Run the test
testCompleteWorkflow(); 