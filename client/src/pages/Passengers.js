import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  User, 
  Calendar,
  Heart,
  Award,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { passengersAPI } from '../services/api';
import toast from 'react-hot-toast';

// Utility function to safely render values
const safeRender = (value, fallback = 'Unknown') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'object') {
    // If it's an object with a name property, use that
    if (value.name && typeof value.name === 'string') return value.name;
    // If it's an object with an id property, use that
    if (value.id && typeof value.id === 'string') return value.id;
    // If it's an array, join it
    if (Array.isArray(value)) return value.join(', ');
    // If it's a date, format it
    if (value instanceof Date) return value.toLocaleDateString();
    // If it's a function, return fallback
    if (typeof value === 'function') return fallback;
    // Try to stringify the object as a last resort
    try {
      return JSON.stringify(value);
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
};

const Passengers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [showRiskAssessment, setShowRiskAssessment] = useState(false);
  const [selectedMission, setSelectedMission] = useState('');

  const queryClient = useQueryClient();

  // Fetch data - temporarily using useState instead of React Query
  const [passengers, setPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setIsLoading(true);
    fetch('/api/passengers')
      .then(res => res.json())
      .then(data => {
        console.log('Direct fetch passengers:', data);
        setPassengers(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Direct fetch passengers error:', err);
        setError(err);
        setIsLoading(false);
      });
  }, []);
  const { data: missions = [] } = useQuery('missions', () => 
    fetch('/api/missions').then(res => res.json()), {
    onSuccess: (data) => {
      console.log('Missions fetched:', data);
    },
    onError: (error) => {
      console.error('Error fetching missions:', error);
    }
  });
  // Fetch health issues - temporarily using useState instead of React Query
  const [healthIssues, setHealthIssues] = useState([]);
  const [healthIssuesLoading, setHealthIssuesLoading] = useState(true);
  const [healthIssuesError, setHealthIssuesError] = useState(null);

  React.useEffect(() => {
    setHealthIssuesLoading(true);
    setHealthIssuesError(null);
    
    fetch('/api/passengers/health-issues')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Direct fetch health issues:', data);
        console.log('Type of healthIssues:', typeof data);
        console.log('Is array:', Array.isArray(data));
        setHealthIssues(Array.isArray(data) ? data : []);
        setHealthIssuesLoading(false);
      })
      .catch(err => {
        console.error('Direct fetch health issues error:', err);
        setHealthIssues([]);
        setHealthIssuesError(err.message);
        setHealthIssuesLoading(false);
      });
  }, []);

  // Debug logging
  console.log('Passengers component render:', {
    passengersCount: passengers?.length || 0,
    missionsCount: missions?.length || 0,
    healthIssuesCount: healthIssues?.length || 0,
    isLoading,
    error: error?.message,
    passengersData: passengers
  });

  // Test direct fetch
  React.useEffect(() => {
    fetch('/api/passengers')
      .then(res => res.json())
      .then(data => {
        console.log('Direct fetch result:', data);
        console.log('Direct fetch count:', data.length);
      })
      .catch(err => {
        console.error('Direct fetch error:', err);
      });
  }, []);

  // Mutations
  const createMutation = useMutation(passengersAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('passengers');
      toast.success('Passenger created successfully');
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error('Passenger creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create passenger');
    },
  });

  const updateMutation = useMutation(
    ({ id, data }) => passengersAPI.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('passengers');
        toast.success('Passenger updated successfully');
        setIsModalOpen(false);
        setEditingPassenger(null);
      },
      onError: () => toast.error('Failed to update passenger'),
    }
  );

  const deleteMutation = useMutation(passengersAPI.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('passengers');
      toast.success('Passenger deleted successfully');
    },
    onError: () => toast.error('Failed to delete passenger'),
  });

  const riskAssessmentMutation = useMutation(
    ({ passengerId, missionId }) => passengersAPI.getRiskAssessment(passengerId, missionId),
    {
      onSuccess: (data) => {
        setSelectedPassenger(data);
        setShowRiskAssessment(true);
      },
      onError: () => toast.error('Failed to assess risk'),
    }
  );

  const PassengerForm = ({ passenger = null, onSubmit }) => {
    const [formData, setFormData] = useState({
      name: passenger?.name || '',
      age: passenger?.age || '',
      healthIssues: passenger?.healthIssues || [],
      experienceLevel: passenger?.experienceLevel || '',
      specialNeeds: passenger?.specialNeeds || [],
      emergencyContact: passenger?.emergencyContact || { name: '', phone: '', relationship: '' }
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showHealthSearch, setShowHealthSearch] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const addSpecialNeed = () => {
      setFormData(prev => ({
        ...prev,
        specialNeeds: [...prev.specialNeeds, '']
      }));
    };

    const updateSpecialNeed = (index, value) => {
      setFormData(prev => ({
        ...prev,
        specialNeeds: prev.specialNeeds.map((need, i) => i === index ? value : need)
      }));
    };

    const removeSpecialNeed = (index) => {
      setFormData(prev => ({
        ...prev,
        specialNeeds: prev.specialNeeds.filter((_, i) => i !== index)
      }));
    };

    const addHealthIssue = (issueKey) => {
      if (!formData.healthIssues.includes(issueKey)) {
        setFormData(prev => ({
          ...prev,
          healthIssues: [...prev.healthIssues, issueKey]
        }));
      }
      setSearchTerm('');
      setShowHealthSearch(false);
    };

    const removeHealthIssue = (issueKey) => {
      setFormData(prev => ({
        ...prev,
        healthIssues: prev.healthIssues.filter(issue => issue !== issueKey)
      }));
    };

    const getHealthIssueDetails = (issueKey) => {
      return healthIssues.find(issue => issue.key === issueKey);
    };

    const getRiskLevelColor = (riskLevel) => {
      switch (riskLevel) {
        case 'CRITICAL': return 'text-red-600 bg-red-100';
        case 'HIGH': return 'text-orange-600 bg-orange-100';
        case 'MODERATE': return 'text-yellow-600 bg-yellow-100';
        case 'LOW': return 'text-green-600 bg-green-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };

    const filteredHealthIssues = searchTerm.trim() === '' 
      ? healthIssues 
      : healthIssues.filter(issue =>
          issue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              placeholder="Enter passenger name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age *
            </label>
            <input
              type="number"
              required
              min="18"
              max="100"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : '' }))}
              className="input-field"
              placeholder="Enter age"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level (0-10) *
            </label>
            <input
              type="number"
              required
              min="0"
              max="10"
              value={formData.experienceLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value ? parseInt(e.target.value) : '' }))}
              className="input-field"
              placeholder="Enter experience level"
            />
          </div>
        </div>

        {/* Health Issues Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Health Issues
          </label>
          
          {/* Current Health Issues */}
          {formData.healthIssues.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-sm text-gray-600">Selected Health Issues:</p>
              {formData.healthIssues.map(issueKey => {
                const issue = getHealthIssueDetails(issueKey);
                return issue ? (
                  <div key={issueKey} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{issue.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(issue.riskLevel)}`}>
                          {issue.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{issue.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeHealthIssue(issueKey)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* Add Health Issue */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowHealthSearch(!showHealthSearch)}
              className="btn-secondary text-sm w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              {showHealthSearch ? 'Cancel' : 'Add Health Issue'}
            </button>

            {showHealthSearch && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Search health issues..."
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {healthIssuesLoading ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>Loading health issues...</p>
                    </div>
                  ) : healthIssuesError ? (
                    <div className="text-center py-4 text-red-500">
                      <p>Error loading health issues: {healthIssuesError}</p>
                    </div>
                  ) : filteredHealthIssues.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>No health issues found</p>
                    </div>
                  ) : (
                    filteredHealthIssues.map(issue => (
                      <div
                        key={issue.key}
                        onClick={() => addHealthIssue(issue.key)}
                        className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{issue.name}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(issue.riskLevel)}`}>
                                {issue.riskLevel}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{issue.description}</p>
                            <p className="text-xs text-gray-500">Category: {issue.category}</p>
                          </div>
                          <Plus className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Needs
          </label>
          <div className="space-y-2">
            {formData.specialNeeds.map((need, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={need}
                  onChange={(e) => updateSpecialNeed(index, e.target.value)}
                  className="input-field flex-1"
                  placeholder="Enter special need"
                />
                <button
                  type="button"
                  onClick={() => removeSpecialNeed(index)}
                  className="btn-danger px-3"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecialNeed}
              className="btn-secondary text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Special Need
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Name
            </label>
            <input
              type="text"
              value={formData.emergencyContact.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, name: e.target.value }
              }))}
              className="input-field"
              placeholder="Contact name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
              }))}
              className="input-field"
              placeholder="Contact phone"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <input
              type="text"
              value={formData.emergencyContact.relationship}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
              }))}
              className="input-field"
              placeholder="Relationship"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false);
              setEditingPassenger(null);
            }}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {passenger ? 'Update Passenger' : 'Create Passenger'}
          </button>
        </div>
      </form>
    );
  };

  const RiskAssessmentModal = () => {
    if (!selectedPassenger) return null;

    const getRiskColor = (level) => {
      switch (level) {
        case 'LOW': return 'text-green-600 bg-green-50';
        case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
        case 'HIGH': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Risk Assessment</h2>
            <button
              onClick={() => setShowRiskAssessment(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-2">Passenger Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedPassenger.passengerName}</p>
                  <p><span className="font-medium">Age:</span> {selectedPassenger.age}</p>
                  <p><span className="font-medium">Health Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(selectedPassenger.healthAssessment?.riskLevel)}`}>
                      {selectedPassenger.healthAssessment?.riskLevel || 'UNKNOWN'}
                    </span>
                  </p>
                  <p><span className="font-medium">Mission Eligible:</span> 
                    {selectedPassenger.healthAssessment?.missionEligible ? (
                      <CheckCircle className="inline w-4 h-4 text-green-500 ml-1" />
                    ) : (
                      <XCircle className="inline w-4 h-4 text-red-500 ml-1" />
                    )}
                  </p>
                  <p><span className="font-medium">Experience Level:</span> {selectedPassenger.experienceLevel}</p>
                </div>
              </div>

              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment Results</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Risk Score:</span> {(selectedPassenger.riskScore * 100).toFixed(1)}%</p>
                  <p><span className="font-medium">Risk Level:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedPassenger.riskLevel)}`}>
                      {selectedPassenger.riskLevel}
                    </span>
                  </p>
                  <p><span className="font-medium">Confidence:</span> {(selectedPassenger.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">Risk Factors</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Age Factor:</span>
                  <span className="font-medium">{((selectedPassenger.age - 18) / 62 * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Factor:</span>
                  <span className="font-medium">{((100 - selectedPassenger.healthScore) / 100 * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience Factor:</span>
                  <span className="font-medium">{((10 - selectedPassenger.experienceLevel) / 10 * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const handleSubmit = (formData) => {
    console.log('Submitting passenger form data:', formData);
    if (editingPassenger) {
      updateMutation.mutate({ id: editingPassenger.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (passenger) => {
    setEditingPassenger(passenger);
    setIsModalOpen(true);
  };

  const handleDelete = (passenger) => {
    if (window.confirm(`Are you sure you want to delete ${passenger.name}?`)) {
      deleteMutation.mutate(passenger.id);
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRiskAssessment = (passenger) => {
    if (!Array.isArray(missions) || missions.length === 0) {
      toast.error('No missions available for risk assessment');
      return;
    }
    
    const missionId = selectedMission || missions[0].id;
    riskAssessmentMutation.mutate({ passengerId: passenger.id, missionId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Passenger Management</h1>
          <p className="text-gray-600">Manage passenger details and risk assessments</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setIsLoading(true);
              fetch('/api/passengers')
                .then(res => res.json())
                .then(data => {
                  console.log('Manual refresh passengers:', data);
                  setPassengers(data);
                  setIsLoading(false);
                })
                .catch(err => {
                  console.error('Manual refresh error:', err);
                  setError(err);
                  setIsLoading(false);
                });
            }}
            className="btn-secondary"
          >
            Refresh Data
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Passenger
          </button>
        </div>
      </div>

      {/* Mission Selection for Risk Assessment */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Settings</h3>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Select Mission for Risk Assessment:</label>
          <select
            value={selectedMission}
            onChange={(e) => setSelectedMission(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">Select a mission</option>
            {Array.isArray(missions) ? missions.map((mission) => (
              <option key={mission.id} value={mission.id}>
                {mission.name} - {safeRender(mission.destination?.name)}
              </option>
            )) : []}
          </select>
        </div>
      </div>

      {/* Debug Info */}
      <div className="card mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Debug Information</h3>
        <div className="text-sm text-gray-600">
          <p>Passengers Count: {passengers?.length || 0}</p>
          <p>Missions Count: {missions?.length || 0}</p>
          <p>Health Issues Count: {healthIssues?.length || 0}</p>
          <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {error?.message || 'None'}</p>
          <p>Passengers Type: {Array.isArray(passengers) ? 'Array' : typeof passengers}</p>
          <p>Raw Passengers Data: {JSON.stringify(passengers?.slice(0, 2))}</p>
        </div>
      </div>

      {/* Passengers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {Array.isArray(passengers) ? passengers.map((passenger) => (
            <motion.div
              key={passenger.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{passenger.name}</h3>
                    <p className="text-sm text-gray-500">ID: {passenger.id.slice(-6)}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleRiskAssessment(passenger)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Risk Assessment"
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(passenger)}
                    className="p-1 text-gray-400 hover:text-yellow-600"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(passenger)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{passenger.age} years old</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Health: {passenger.healthAssessment?.riskLevel || 'UNKNOWN'}
                  </span>
                  {passenger.healthAssessment?.missionEligible === false && (
                    <AlertTriangle className="w-4 h-4 text-red-500" title="Not eligible for mission" />
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Experience: {passenger.experienceLevel}/10</span>
                </div>

                {passenger.healthIssues && passenger.healthIssues.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Health Issues:</p>
                    <div className="flex flex-wrap gap-1">
                      {passenger.healthIssues.map((issueKey, index) => {
                        const issue = healthIssues.find(h => h.key === issueKey);
                        return issue ? (
                          <span
                            key={index}
                            className={`px-2 py-1 text-xs rounded-full ${getRiskLevelColor(issue.riskLevel)}`}
                          >
                            {issue.name}
                          </span>
                        ) : (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {issueKey}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {passenger.specialNeeds.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Special Needs:</p>
                    <div className="flex flex-wrap gap-1">
                      {passenger.specialNeeds.map((need, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {passenger.emergencyContact.name && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-700 mb-1">Emergency Contact:</p>
                    <p className="text-xs text-gray-600">{passenger.emergencyContact.name}</p>
                    <p className="text-xs text-gray-600">{passenger.emergencyContact.phone}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )) : []}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPassenger ? 'Edit Passenger' : 'Add New Passenger'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingPassenger(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <PassengerForm
                passenger={editingPassenger}
                onSubmit={handleSubmit}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Risk Assessment Modal */}
      <AnimatePresence>
        {showRiskAssessment && <RiskAssessmentModal />}
      </AnimatePresence>
    </div>
  );
};

export default Passengers; 