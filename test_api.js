const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');

    // Test 1: Create a passenger
    console.log('1. Creating a passenger...');
    const passengerData = {
      name: 'John Doe',
      age: 30,
      healthScore: 85,
      experienceLevel: 7,
      specialNeeds: [],
      emergencyContact: { name: 'Jane Doe', phone: '123-456-7890', relationship: 'Spouse' }
    };

    const passengerResponse = await axios.post(`${API_BASE_URL}/passengers`, passengerData);
    console.log('✅ Passenger created:', passengerResponse.data);
    const passengerId = passengerResponse.data.id;

    // Test 2: Create a mission
    console.log('\n2. Creating a mission...');
    const missionData = {
      name: 'Test Mission to Mars',
      description: 'A test mission to verify API functionality',
      destination: 'Mars',
      distance: 5000,
      weatherRisk: 30,
      duration: 7,
      maxPassengers: 5,
      departureTime: new Date().toISOString().split('T')[0]
    };

    const missionResponse = await axios.post(`${API_BASE_URL}/missions`, missionData);
    console.log('✅ Mission created:', missionResponse.data);
    const missionId = missionResponse.data.id;

    // Test 3: Assign passenger to mission
    console.log('\n3. Assigning passenger to mission...');
    const assignResponse = await axios.post(`${API_BASE_URL}/missions/${missionId}/passengers`, {
      passengerId: passengerId
    });
    console.log('✅ Passenger assigned:', assignResponse.data);

    // Test 4: Get all missions
    console.log('\n4. Fetching all missions...');
    const missionsResponse = await axios.get(`${API_BASE_URL}/missions`);
    console.log('✅ Missions fetched:', missionsResponse.data.length, 'missions');

    // Test 5: Get all passengers
    console.log('\n5. Fetching all passengers...');
    const passengersResponse = await axios.get(`${API_BASE_URL}/passengers`);
    console.log('✅ Passengers fetched:', passengersResponse.data.length, 'passengers');

    console.log('\n🎉 All tests passed! API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI(); 