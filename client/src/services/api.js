import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    if (config.method === 'post' || config.method === 'put') {
      console.log('API Request Data:', config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const passengersAPI = {
  getAll: () => api.get('/passengers'),
  getById: (id) => api.get(`/passengers/${id}`),
  create: (data) => api.post('/passengers', data),
  update: (id, data) => api.put(`/passengers/${id}`, data),
  delete: (id) => api.delete(`/passengers/${id}`),
  getHealthIssues: (search) => api.get('/passengers/health-issues', { params: { search } })
};

export const missionsAPI = {
  getAll: () => api.get('/missions'),
  getById: (id) => api.get(`/missions/${id}`),
  create: (data) => api.post('/missions', data),
  update: (id, data) => api.put(`/missions/${id}`, data),
  delete: (id) => api.delete(`/missions/${id}`),
  addPassenger: (missionId, passengerId) => api.post(`/missions/${missionId}/passengers`, { passengerId }),
  removePassenger: (missionId, passengerId) => api.delete(`/missions/${missionId}/passengers/${passengerId}`),
  getRiskAssessment: (missionId) => api.get(`/missions/${missionId}/risk-assessment`),
  optimizeRoute: (missionId) => api.post(`/missions/${missionId}/optimize-route`),
  // New endpoints for destinations and rockets
  getDestinations: () => api.get('/missions/destinations/available'),
  searchDestinations: (query) => api.get('/missions/destinations/search', { params: { query } }),
  getRockets: () => api.get('/missions/rockets/available'),
  getRecommendations: (destinationId, crewCount) => api.get('/missions/recommendations', { 
    params: { destinationId, crewCount } 
  })
};

export const risksAPI = {
  getAll: () => api.get('/risks'),
  getAnalysis: () => api.get('/risks/analysis/summary'),
  create: (data) => api.post('/risks', data),
  update: (id, data) => api.put(`/risks/${id}`, data),
  delete: (id) => api.delete(`/risks/${id}`)
};

export const assessmentsAPI = {
  getAll: () => api.get('/assessments'),
  getStatistics: () => api.get('/assessments/statistics/overview'),
  getAIStatus: () => api.get('/assessments/ai/status'),
  retrainAI: () => api.post('/assessments/ai/retrain'),
  create: (data) => api.post('/assessments', data),
  update: (id, data) => api.put(`/assessments/${id}`, data),
  delete: (id) => api.delete(`/assessments/${id}`)
};

export default api; 