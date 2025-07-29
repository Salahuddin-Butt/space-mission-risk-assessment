const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testHealthSystem() {
  try {
    console.log('Testing Health Assessment System...\n');

    // Test 1: Get health issues
    console.log('1. Fetching health issues...');
    const healthIssuesResponse = await axios.get(`${API_BASE_URL}/passengers/health-issues`);
    console.log('✅ Health issues fetched:', healthIssuesResponse.data.length, 'issues');

    // Test 2: Create passenger with no health issues
    console.log('\n2. Creating passenger with no health issues...');
    const healthyPassengerData = {
      name: 'John Healthy',
      age: 30,
      healthIssues: [],
      experienceLevel: 8,
      specialNeeds: [],
      emergencyContact: { name: 'Jane Healthy', phone: '123-456-7890', relationship: 'Spouse' }
    };

    const healthyPassengerResponse = await axios.post(`${API_BASE_URL}/passengers`, healthyPassengerData);
    console.log('✅ Healthy passenger created:', healthyPassengerResponse.data.name);
    console.log('   Health Assessment:', healthyPassengerResponse.data.healthAssessment);

    // Test 3: Create passenger with critical health issues
    console.log('\n3. Creating passenger with critical health issues...');
    const criticalPassengerData = {
      name: 'Mary Critical',
      age: 45,
      healthIssues: ['heart-disease', 'cancer-active'],
      experienceLevel: 5,
      specialNeeds: [],
      emergencyContact: { name: 'Bob Critical', phone: '123-456-7891', relationship: 'Spouse' }
    };

    const criticalPassengerResponse = await axios.post(`${API_BASE_URL}/passengers`, criticalPassengerData);
    console.log('✅ Critical passenger created:', criticalPassengerResponse.data.name);
    console.log('   Health Assessment:', criticalPassengerResponse.data.healthAssessment);

    // Test 4: Create passenger with moderate health issues
    console.log('\n4. Creating passenger with moderate health issues...');
    const moderatePassengerData = {
      name: 'Tom Moderate',
      age: 35,
      healthIssues: ['cough', 'migraines'],
      experienceLevel: 7,
      specialNeeds: [],
      emergencyContact: { name: 'Sara Moderate', phone: '123-456-7892', relationship: 'Spouse' }
    };

    const moderatePassengerResponse = await axios.post(`${API_BASE_URL}/passengers`, moderatePassengerData);
    console.log('✅ Moderate passenger created:', moderatePassengerResponse.data.name);
    console.log('   Health Assessment:', moderatePassengerResponse.data.healthAssessment);

    // Test 5: Create a mission
    console.log('\n5. Creating a mission...');
    const missionData = {
      name: 'Health Test Mission',
      description: 'Testing health assessment system',
      destination: 'Mars',
      distance: 5000,
      weatherRisk: 30,
      duration: 7,
      maxPassengers: 5,
      departureTime: new Date().toISOString().split('T')[0]
    };

    const missionResponse = await axios.post(`${API_BASE_URL}/missions`, missionData);
    console.log('✅ Mission created:', missionResponse.data.name);
    const missionId = missionResponse.data.id;

    // Test 6: Try to assign healthy passenger (should succeed)
    console.log('\n6. Assigning healthy passenger to mission...');
    try {
      const assignHealthyResponse = await axios.post(`${API_BASE_URL}/missions/${missionId}/passengers`, {
        passengerId: healthyPassengerResponse.data.id
      });
      console.log('✅ Healthy passenger assigned successfully');
    } catch (error) {
      console.log('❌ Failed to assign healthy passenger:', error.response?.data?.message);
    }

    // Test 7: Try to assign critical passenger (should fail)
    console.log('\n7. Trying to assign critical passenger to mission...');
    try {
      await axios.post(`${API_BASE_URL}/missions/${missionId}/passengers`, {
        passengerId: criticalPassengerResponse.data.id
      });
      console.log('❌ Critical passenger was assigned (should have failed)');
    } catch (error) {
      console.log('✅ Correctly rejected critical passenger:', error.response?.data?.message);
    }

    // Test 8: Try to assign moderate passenger (should succeed)
    console.log('\n8. Assigning moderate passenger to mission...');
    try {
      const assignModerateResponse = await axios.post(`${API_BASE_URL}/missions/${missionId}/passengers`, {
        passengerId: moderatePassengerResponse.data.id
      });
      console.log('✅ Moderate passenger assigned successfully');
    } catch (error) {
      console.log('❌ Failed to assign moderate passenger:', error.response?.data?.message);
    }

    // Test 9: Search health issues
    console.log('\n9. Searching health issues...');
    const searchResponse = await axios.get(`${API_BASE_URL}/passengers/health-issues?search=heart`);
    console.log('✅ Search results:', searchResponse.data.length, 'heart-related issues found');

    console.log('\n🎉 Health assessment system test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testHealthSystem(); 