const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function setupTestData() {
  try {
    console.log('Setting up test data...');

    // Create test passengers
    const passengers = [
      {
        name: 'John Smith',
        age: 35,
        experienceLevel: 5,
        healthIssues: ['Minor cough']
      },
      {
        name: 'Sarah Johnson',
        age: 28,
        experienceLevel: 3,
        healthIssues: []
      },
      {
        name: 'Mike Chen',
        age: 42,
        experienceLevel: 7,
        healthIssues: ['Seasonal allergies']
      },
      {
        name: 'Emily Davis',
        age: 31,
        experienceLevel: 4,
        healthIssues: []
      }
    ];

    console.log('Creating passengers...');
    for (const passenger of passengers) {
      const response = await axios.post(`${API_BASE}/passengers`, passenger);
      console.log(`Created passenger: ${response.data.name}`);
    }

    // Create test mission
    const mission = {
      name: 'TO MOON',
      destinationId: 'moon',
      rocketId: 'starship',
      crewCount: 4,
      departureTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      description: 'Mission to establish lunar base'
    };

    console.log('Creating mission...');
    const missionResponse = await axios.post(`${API_BASE}/missions`, mission);
    console.log(`Created mission: ${missionResponse.data.name}`);

    // Get all passengers and missions
    const [passengersResponse, missionsResponse] = await Promise.all([
      axios.get(`${API_BASE}/passengers`),
      axios.get(`${API_BASE}/missions`)
    ]);

    console.log('\nCurrent data:');
    console.log(`Passengers: ${passengersResponse.data.length}`);
    console.log(`Missions: ${missionsResponse.data.length}`);

    console.log('\nTest data setup complete!');
  } catch (error) {
    console.error('Error setting up test data:', error.response?.data || error.message);
  }
}

setupTestData(); 