const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testPassengerAssignment() {
  try {
    console.log('Testing passenger assignment functionality...\n');

    // Get current data
    const [passengersResponse, missionsResponse] = await Promise.all([
      axios.get(`${API_BASE}/passengers`),
      axios.get(`${API_BASE}/missions`)
    ]);

    const passengers = passengersResponse.data;
    const missions = missionsResponse.data;

    console.log(`Found ${passengers.length} passengers and ${missions.length} missions`);

    if (passengers.length === 0) {
      console.log('No passengers available. Creating test passengers...');
      
      const testPassengers = [
        { name: 'Test Passenger 1', age: 30, experienceLevel: 5, healthIssues: [] },
        { name: 'Test Passenger 2', age: 35, experienceLevel: 7, healthIssues: ['Minor cough'] }
      ];

      for (const passenger of testPassengers) {
        await axios.post(`${API_BASE}/passengers`, passenger);
        console.log(`Created passenger: ${passenger.name}`);
      }
    }

    if (missions.length === 0) {
      console.log('No missions available. Creating test mission...');
      
      const testMission = {
        name: 'Test Mission',
        destinationId: 'moon',
        rocketId: 'starship',
        crewCount: 4,
        departureTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Test mission for passenger assignment'
      };

      const missionResponse = await axios.post(`${API_BASE}/missions`, testMission);
      console.log(`Created mission: ${missionResponse.data.name}`);
    }

    // Get updated data
    const [updatedPassengersResponse, updatedMissionsResponse] = await Promise.all([
      axios.get(`${API_BASE}/passengers`),
      axios.get(`${API_BASE}/missions`)
    ]);

    const updatedPassengers = updatedPassengersResponse.data;
    const updatedMissions = updatedMissionsResponse.data;

    console.log(`\nCurrent data: ${updatedPassengers.length} passengers, ${updatedMissions.length} missions`);

    // Test passenger assignment
    const mission = updatedMissions[0];
    const passenger = updatedPassengers[0];

    console.log(`\nTesting assignment of ${passenger.name} to ${mission.name}...`);

    // Assign passenger
    const assignmentResponse = await axios.post(`${API_BASE}/missions/${mission.id}/passengers`, {
      passengerId: passenger.id
    });

    console.log('✅ Passenger assignment successful!');
    console.log(`Mission now has ${assignmentResponse.data.passengers.length} passengers`);

    // Test removing passenger
    console.log(`\nTesting removal of ${passenger.name} from ${mission.name}...`);

    const removalResponse = await axios.delete(`${API_BASE}/missions/${mission.id}/passengers/${passenger.id}`);

    console.log('✅ Passenger removal successful!');
    console.log(`Mission now has ${removalResponse.data.passengers.length} passengers`);

    console.log('\n🎉 All passenger assignment tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testPassengerAssignment(); 