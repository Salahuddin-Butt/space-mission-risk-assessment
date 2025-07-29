const axios = require('axios');

async function testFrontendData() {
  console.log('Testing frontend data fetching...\n');

  try {
    // Test passengers API
    console.log('1. Testing passengers API...');
    const passengersResponse = await axios.get('http://localhost:3000/api/passengers');
    console.log(`✅ Passengers API: ${passengersResponse.data.length} passengers found`);
    console.log('Sample passenger:', passengersResponse.data[0]?.name || 'No passengers');
    console.log('');

    // Test missions API
    console.log('2. Testing missions API...');
    const missionsResponse = await axios.get('http://localhost:3000/api/missions');
    console.log(`✅ Missions API: ${missionsResponse.data.length} missions found`);
    console.log('Sample mission:', missionsResponse.data[0]?.name || 'No missions');
    console.log('');

    // Test health issues API
    console.log('3. Testing health issues API...');
    const healthIssuesResponse = await axios.get('http://localhost:3000/api/passengers/health-issues');
    console.log(`✅ Health Issues API: ${healthIssuesResponse.data.length} health issues found`);
    console.log('Sample health issue:', healthIssuesResponse.data[0]?.name || 'No health issues');
    console.log('');

    // Test risk assessment API
    console.log('4. Testing risk assessment API...');
    const risksResponse = await axios.get('http://localhost:3000/api/risks');
    console.log(`✅ Risks API: ${risksResponse.data.length} risks found`);
    console.log('');

    // Test assessments API
    console.log('5. Testing assessments API...');
    const assessmentsResponse = await axios.get('http://localhost:3000/api/assessments');
    console.log(`✅ Assessments API: ${assessmentsResponse.data.length} assessments found`);
    console.log('');

    console.log('🎉 All API tests passed! The backend is working correctly.');
    console.log('\nIf the frontend is not showing data, the issue is likely:');
    console.log('1. React Query cache not updating');
    console.log('2. Frontend not properly connected to backend');
    console.log('3. Component rendering issues');

  } catch (error) {
    console.error('❌ Error testing APIs:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testFrontendData(); 