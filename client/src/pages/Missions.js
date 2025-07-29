import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { 
  Plus, Edit, Trash2, Users, Activity, MapPin, Rocket, 
  Calendar, Clock, Target, AlertTriangle, CheckCircle, 
  Search, Globe, Zap, Shield, TrendingUp, XCircle, BarChart3
} from 'lucide-react';
import { missionsAPI } from '../services/api';
import { useSocket } from '../contexts/SocketContext';

// Mission Form Component
const MissionForm = ({ mission, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: mission?.name || '',
    destinationId: mission?.destination?.id || '',
    rocketId: mission?.rocket?.id || '',
    crewCount: mission?.crewCount || 1,
    departureTime: mission?.departureTime ? mission.departureTime.split('T')[0] : '',
    description: mission?.description || ''
  });

  const [destinations, setDestinations] = useState([]);
  const [rockets, setRockets] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch destinations and rockets
  useEffect(() => {
    fetchDestinations();
    fetchRockets();
  }, []);

  // Fetch recommendations when destination or crew count changes
  useEffect(() => {
    if (formData.destinationId && formData.crewCount) {
      fetchRecommendations();
    }
  }, [formData.destinationId, formData.crewCount]);

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/missions/destinations/available');
      const data = await response.json();
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const fetchRockets = async () => {
    try {
      const response = await fetch('/api/missions/rockets/available');
      const data = await response.json();
      setRockets(data);
    } catch (error) {
      console.error('Error fetching rockets:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/missions/recommendations?destinationId=${formData.destinationId}&crewCount=${formData.crewCount}`);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const submitData = {
      ...formData,
      departureTime: new Date(formData.departureTime).toISOString()
    };

    onSubmit(submitData);
    setLoading(false);
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDestination = destinations.find(d => d.id === formData.destinationId);
  const selectedRocket = rockets.find(r => r.id === formData.rocketId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {mission ? `Edit Mission - ${safeRender(mission.name)}` : 'Create New Mission'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Mission Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crew Count
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.crewCount}
                onChange={(e) => setFormData({...formData, crewCount: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Destination Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded-md mb-2"
              />
            </div>
            <select
              value={formData.destinationId}
              onChange={(e) => setFormData({...formData, destinationId: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a destination</option>
              {filteredDestinations.map(dest => (
                <option key={dest.id} value={dest.id}>
                  {safeRender(dest.name)} - {safeRender(dest.distance)}M km
                </option>
              ))}
            </select>
            
            {selectedDestination && (
              <div className="mt-2 p-3 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-900">{safeRender(selectedDestination.name)}</h4>
                <p className="text-sm text-blue-700">{safeRender(selectedDestination.description)}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-blue-600">
                  <div><Globe className="inline h-3 w-3" /> Gravity: {safeRender(selectedDestination.gravity)}g</div>
                  <div><Zap className="inline h-3 w-3" /> Radiation: {safeRender(selectedDestination.radiation)}</div>
                  <div><Shield className="inline h-3 w-3" /> Atmosphere: {safeRender(selectedDestination.atmosphere)}</div>
                  <div><Target className="inline h-3 w-3" /> Complexity: {safeRender(selectedDestination.missionComplexity)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Rocket Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rocket
            </label>
            <select
              value={formData.rocketId}
              onChange={(e) => setFormData({...formData, rocketId: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a rocket</option>
              {rockets.map(rocket => (
                <option key={rocket.id} value={rocket.id}>
                  {safeRender(rocket.name)} - {safeRender(rocket.crewCapacity)} crew, {safeRender(rocket.maxDistance)}M km range
                </option>
              ))}
            </select>
            
            {selectedRocket && (
              <div className="mt-2 p-3 bg-green-50 rounded-md">
                <h4 className="font-medium text-green-900">{safeRender(selectedRocket.name)}</h4>
                <p className="text-sm text-green-700">{safeRender(selectedRocket.description)}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-green-600">
                  <div><Users className="inline h-3 w-3" /> Crew: {safeRender(selectedRocket.crewCapacity)}</div>
                  <div><MapPin className="inline h-3 w-3" /> Range: {safeRender(selectedRocket.maxDistance)}M km</div>
                  <div><Shield className="inline h-3 w-3" /> Reliability: {safeRender(selectedRocket.reliability, 0) ? (safeRender(selectedRocket.reliability, 0) * 100).toFixed(1) : '0'}%</div>
                  <div><TrendingUp className="inline h-3 w-3" /> Efficiency: {safeRender(selectedRocket.fuelEfficiency, 0) ? (safeRender(selectedRocket.fuelEfficiency, 0) * 100).toFixed(1) : '0'}%</div>
                </div>
              </div>
            )}
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Date
            </label>
            <input
              type="date"
              value={formData.departureTime}
              onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-md">
              <h4 className="font-medium text-yellow-900 mb-2">Mission Recommendations</h4>
              {recommendations.map((rec, index) => (
                <div key={index} className="mb-3">
                  <h5 className="font-medium text-yellow-800">{safeRender(rec.title, 'Recommendation')}</h5>
                  <ul className="mt-1 space-y-1">
                    {rec.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-yellow-700 flex items-start">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>{safeRender(item.name, 'Unknown')}:</strong> {safeRender(item.reason, 'No reason provided')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : (mission ? 'Update Mission' : 'Create Mission')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PassengerAssignmentModal = ({ mission, passengers, onAssign, onRemove, onClose }) => {
  const [selectedPassenger, setSelectedPassenger] = useState('');
  
  const availablePassengers = Array.isArray(passengers) ? passengers.filter(p => 
    !mission.passengers.includes(p.id)
  ) : [];

  // Debug logging
  console.log('PassengerAssignmentModal debug:', {
    missionId: mission?.id,
    missionPassengers: mission?.passengers,
    totalPassengers: passengers?.length,
    availablePassengers: availablePassengers.length,
    passengers: passengers
  });

  const handleAssign = () => {
    if (selectedPassenger) {
      onAssign(selectedPassenger);
      setSelectedPassenger('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          Manage Passengers - {safeRender(mission.name)}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assign Passengers */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Assign Passengers</h4>
            <div className="space-y-3">
              <select
                value={selectedPassenger}
                onChange={(e) => setSelectedPassenger(e.target.value)}
                className="input-field"
              >
                <option value="">Select a passenger...</option>
                {availablePassengers.map(passenger => (
                                  <option key={passenger.id} value={passenger.id}>
                  {safeRender(passenger.name)} - {safeRender(passenger.age)} years
                </option>
                ))}
              </select>
              
              <button
                onClick={handleAssign}
                disabled={!selectedPassenger}
                className="btn-primary w-full"
              >
                Assign Passenger
              </button>
            </div>
          </div>
          
          {/* Current Passengers */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">
              Current Passengers ({mission.passengers.length}/{mission.crewCount || mission.rocket?.crewCapacity || 4})
            </h4>
            <div className="space-y-2">
              {mission.passengers.map(passengerId => {
                const passenger = passengers.find(p => p.id === passengerId);
                return passenger ? (
                  <div key={passengerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{safeRender(passenger.name)}</p>
                      <p className="text-sm text-gray-600">{safeRender(passenger.age)} years</p>
                    </div>
                    <button
                      onClick={() => onRemove(passengerId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                ) : null;
              })}
              {mission.passengers.length === 0 && (
                <p className="text-gray-500 text-sm">No passengers assigned</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const RiskAssessmentModal = ({ mission, assessment, onClose }) => {
  if (!assessment || !mission) return null;

  const getRiskLevelColor = (score) => {
    if (score <= 0.3) return 'text-green-600 bg-green-100';
    if (score <= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLevelText = (score) => {
    if (score <= 0.3) return 'Low';
    if (score <= 0.6) return 'Medium';
    return 'High';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          Risk Assessment - {safeRender(mission.name)}
        </h3>
        
        <div className="space-y-6">
          {/* Overall Risk Score */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">Overall Risk Assessment</h4>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(assessment.overallRisk)}`}>
                {getRiskLevelText(assessment.overallRisk)} Risk
              </div>
              <div className="text-2xl font-bold">
                {assessment.overallRisk ? (assessment.overallRisk * 100).toFixed(1) : '0'}%
              </div>
            </div>
          </div>
          
          {/* Risk Factors */}
          {assessment.riskFactors && assessment.riskFactors.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Risk Factors</h4>
              <div className="space-y-3">
                {assessment.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{safeRender(factor.name)}</p>
                      <p className="text-sm text-gray-600">{safeRender(factor.description)}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${getRiskLevelColor(factor.score || 0)}`}>
                      {factor.score ? (factor.score * 100).toFixed(1) : '0'}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Recommendations */}
          {assessment.recommendations && assessment.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {assessment.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{safeRender(rec)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const RouteOptimizationModal = ({ mission, optimization, onClose, passengers }) => {
  if (!optimization || !mission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">
          Route Optimization - {safeRender(mission.name)}
        </h3>
        
        <div className="space-y-6">
          {/* Optimization Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">
                {optimization.fitness ? (optimization.fitness * 100).toFixed(1) : 'N/A'}%
              </p>
              <p className="text-sm text-gray-600">Fitness Score</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">
                {optimization.averageRisk ? (optimization.averageRisk * 100).toFixed(1) : 'N/A'}%
              </p>
              <p className="text-sm text-gray-600">Average Risk</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">
                {optimization.generations || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">Generations</p>
            </div>
          </div>
          
          {/* Optimal Route */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Optimal Route</h4>
            <div className="space-y-2">
              {optimization.optimalRoute && Array.isArray(optimization.optimalRoute) ? (
                optimization.optimalRoute.map((passengerIndex, index) => {
                  const passengerId = mission.passengers[passengerIndex];
                  const passenger = passengers.find(p => p.id === passengerId);
                  return passenger ? (
                    <div key={passengerIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{safeRender(passenger.name)}</p>
                        <p className="text-sm text-gray-600">{safeRender(passenger.age)} years</p>
                      </div>
                    </div>
                  ) : null;
                })
              ) : (
                <p className="text-gray-500 text-sm">No optimal route data available</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const MissionCard = ({ mission, onEdit, onDelete, onAssignPassengers, onRiskAssessment, onOptimizeRoute }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PLANNED': return 'text-blue-600 bg-blue-100';
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'COMPLETED': return 'text-gray-600 bg-gray-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PLANNED': return <Calendar size={16} />;
      case 'ACTIVE': return <Activity size={16} />;
      case 'COMPLETED': return <CheckCircle size={16} />;
      case 'CANCELLED': return <AlertTriangle size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HIGH': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{safeRender(mission.name)}</h3>
            <p className="text-sm text-gray-600">{safeRender(mission.description)}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(safeRender(mission.status))}`}>
          {getStatusIcon(safeRender(mission.status))}
                      <span>{safeRender(mission.status)}</span>
        </div>
      </div>

      {/* Mission Progress for Active Missions */}
      {safeRender(mission.status) === 'ACTIVE' && safeRender(mission.progress) !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{safeRender(mission.currentPhase, 'In Progress')}</span>
            <span>{Math.round(safeRender(mission.progress, 0))}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${safeRender(mission.progress, 0)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Mission Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Globe size={16} className="text-blue-500" />
            <span className="text-sm text-gray-600">
              <strong>Destination:</strong> {safeRender(mission.destination?.name)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Rocket size={16} className="text-green-500" />
            <span className="text-sm text-gray-600">
              <strong>Rocket:</strong> {safeRender(mission.rocket?.name)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-purple-500" />
            <span className="text-sm text-gray-600">
              <strong>Distance:</strong> {mission.route?.distance ? Number(mission.route.distance).toFixed(1) : 0}M km
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Users size={16} className="text-indigo-500" />
            <span className="text-sm text-gray-600">
              <strong>Crew:</strong> {safeRender(mission.passengers?.length, 0)}/{safeRender(mission.crewCount, 0)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-orange-500" />
            <span className="text-sm text-gray-600">
              <strong>Duration:</strong> {safeRender(mission.route?.travelTime?.days, 0)} days
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-red-500" />
            <span className="text-sm text-gray-600">
              <strong>Departure:</strong> {formatDate(safeRender(mission.departureTime))}
            </span>
          </div>
        </div>
      </div>

      {/* Risk Assessment Summary */}
      {safeRender(mission.riskAssessment) && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Risk Assessment</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(safeRender(mission.riskAssessment?.riskLevel))}`}>
              {safeRender(mission.riskAssessment?.riskLevel)} RISK
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Overall Risk: {mission.riskAssessment?.overallRisk ? (Number(mission.riskAssessment.overallRisk) * 100).toFixed(1) : '0'}%
          </div>
        </div>
      )}

      {/* Route Information */}
      {safeRender(mission.route) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Route Information</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            <div><strong>Complexity:</strong> {mission.route?.complexity ? Number(mission.route.complexity).toFixed(1) : 'N/A'}/10</div>
            <div><strong>Fuel Required:</strong> {mission.route?.fuelRequired ? Number(mission.route.fuelRequired).toLocaleString() : 0} kg</div>
            <div><strong>Waypoints:</strong> {mission.route?.waypoints ? mission.route.waypoints.length : 0}</div>
            <div><strong>Risks:</strong> {mission.route?.risks ? mission.route.risks.length : 0} identified</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(mission)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
            title="Edit Mission"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onAssignPassengers(mission)}
            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md"
            title="Assign Passengers"
          >
            <Users size={16} />
          </button>
          <button
            onClick={() => onRiskAssessment(mission)}
            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md"
            title="Risk Assessment"
          >
            <Target size={16} />
          </button>
          <button
            onClick={() => onOptimizeRoute(mission)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md"
            title="Optimize Route"
          >
            <MapPin size={16} />
          </button>
        </div>
        <button
          onClick={() => onDelete(mission.id)}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md"
          title="Delete Mission"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

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

const Missions = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [routeOptimization, setRouteOptimization] = useState(null);
  
  // queryClient removed - using direct fetch calls instead
  const { socket } = useSocket();

  // Fetch data - temporarily using useState instead of React Query
  const [missions, setMissions] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [missionsLoading, setMissionsLoading] = useState(true);
  const [passengersLoading, setPassengersLoading] = useState(true);

  React.useEffect(() => {
    // Fetch missions
    setMissionsLoading(true);
    fetch('/api/missions')
      .then(res => res.json())
      .then(data => {
        console.log('Direct fetch missions:', data);
        setMissions(data);
        setMissionsLoading(false);
      })
      .catch(err => {
        console.error('Direct fetch missions error:', err);
        setMissionsLoading(false);
      });

    // Fetch passengers
    setPassengersLoading(true);
    fetch('/api/passengers')
      .then(res => res.json())
      .then(data => {
        console.log('Direct fetch passengers:', data);
        setPassengers(data);
        setPassengersLoading(false);
      })
      .catch(err => {
        console.error('Direct fetch passengers error:', err);
        setPassengersLoading(false);
      });
  }, []);

  // Debug logging
  console.log('Missions component render:', {
    missionsCount: missions?.length || 0,
    passengersCount: passengers?.length || 0,
    missionsLoading,
    passengersLoading
  });

  // Mutations converted to direct fetch calls in handleSubmit, handleDelete, handleAssignPassenger, and handleRemovePassenger

  const [isLoadingRiskAssessment, setIsLoadingRiskAssessment] = useState(false);

  const handleRiskAssessment = async (mission) => {
    setIsLoadingRiskAssessment(true);
    try {
      const response = await fetch(`/api/missions/${mission.id}/risk-assessment`);
      if (response.ok) {
        const data = await response.json();
        setRiskAssessment(data);
        setShowRiskModal(true);
      } else {
        toast.error('Failed to assess risk');
      }
    } catch (error) {
      console.error('Error assessing risk:', error);
      toast.error('Failed to assess risk');
    } finally {
      setIsLoadingRiskAssessment(false);
    }
  };

  const [isLoadingRouteOptimization, setIsLoadingRouteOptimization] = useState(false);

  const handleOptimizeRoute = async (mission) => {
    setIsLoadingRouteOptimization(true);
    try {
      const response = await fetch(`/api/missions/${mission.id}/optimize-route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRouteOptimization(data);
        setShowRouteModal(true);
      } else {
        toast.error('Failed to optimize route');
      }
    } catch (error) {
      console.error('Error optimizing route:', error);
      toast.error('Failed to optimize route');
    } finally {
      setIsLoadingRouteOptimization(false);
    }
  };

  const handleSubmit = async (formData) => {
    console.log('Submitting mission form data:', formData);
    
    try {
      if (editingMission) {
        // Update existing mission
        const response = await fetch(`/api/missions/${editingMission.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success('Mission updated successfully');
          setShowForm(false);
          setEditingMission(null);
          
          // Refresh missions data
          const updatedMissions = await fetch('/api/missions').then(res => res.json());
          setMissions(updatedMissions);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to update mission');
        }
      } else {
        // Create new mission
        const response = await fetch('/api/missions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success('Mission created successfully');
          setShowForm(false);
          
          // Refresh missions data
          const updatedMissions = await fetch('/api/missions').then(res => res.json());
          setMissions(updatedMissions);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to create mission');
        }
      }
    } catch (error) {
      console.error('Mission operation error:', error);
      toast.error('Failed to save mission');
    }
  };

  const handleEdit = (mission) => {
    setEditingMission(mission);
    setShowForm(true);
  };

  const handleDelete = async (missionId) => {
    if (window.confirm('Are you sure you want to delete this mission?')) {
      try {
        const response = await fetch(`/api/missions/${missionId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Mission deleted successfully');
          
          // Refresh missions data
          const updatedMissions = await fetch('/api/missions').then(res => res.json());
          setMissions(updatedMissions);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to delete mission');
        }
      } catch (error) {
        console.error('Mission deletion error:', error);
        toast.error('Failed to delete mission');
      }
    }
  };

  const handleAssignPassengers = (mission) => {
    console.log('Opening passenger assignment modal for mission:', mission);
    setSelectedMission(mission);
    setShowPassengerModal(true);
  };

  const handleAssignPassenger = async (passengerId) => {
    console.log('Assigning passenger:', passengerId, 'to mission:', selectedMission?.id);
    
    try {
      const response = await fetch(`/api/missions/${selectedMission.id}/passengers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passengerId }),
      });

      if (response.ok) {
        toast.success('Passenger assigned successfully');
        
        // Refresh missions data
        const updatedMissions = await fetch('/api/missions').then(res => res.json());
        setMissions(updatedMissions);
        
        // Close the modal after successful assignment
        setShowPassengerModal(false);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to assign passenger');
      }
    } catch (error) {
      console.error('Assignment error:', error);
      toast.error('Failed to assign passenger');
    }
  };

  const handleRemovePassenger = async (passengerId) => {
    try {
      const response = await fetch(`/api/missions/${selectedMission.id}/passengers/${passengerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Passenger removed successfully');
        
        // Refresh missions data
        const updatedMissions = await fetch('/api/missions').then(res => res.json());
        setMissions(updatedMissions);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to remove passenger');
      }
    } catch (error) {
      console.error('Remove passenger error:', error);
      toast.error('Failed to remove passenger');
    }
  };





  if (missionsLoading || passengersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Missions</h1>
          <p className="text-gray-600">Manage space missions and passenger assignments</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              // Refresh missions
              setMissionsLoading(true);
              fetch('/api/missions')
                .then(res => res.json())
                .then(data => {
                  console.log('Manual refresh missions:', data);
                  setMissions(data);
                  setMissionsLoading(false);
                })
                .catch(err => {
                  console.error('Manual refresh missions error:', err);
                  setMissionsLoading(false);
                });

              // Refresh passengers
              setPassengersLoading(true);
              fetch('/api/passengers')
                .then(res => res.json())
                .then(data => {
                  console.log('Manual refresh passengers:', data);
                  setPassengers(data);
                  setPassengersLoading(false);
                })
                .catch(err => {
                  console.error('Manual refresh passengers error:', err);
                  setPassengersLoading(false);
                });
            }}
            className="btn-secondary"
          >
            Refresh Data
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus size={20} className="mr-2" />
            New Mission
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="card mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Debug Information</h3>
        <div className="text-sm text-gray-600">
          <p>Missions Count: {missions?.length || 0}</p>
          <p>Passengers Count: {passengers?.length || 0}</p>
          <p>Missions Loading: {missionsLoading ? 'Yes' : 'No'}</p>
          <p>Passengers Loading: {passengersLoading ? 'Yes' : 'No'}</p>
          <p>Missions Type: {Array.isArray(missions) ? 'Array' : typeof missions}</p>
          <p>Selected Mission: {safeRender(selectedMission?.name || selectedMission?.id)}</p>
          <p>Selected Mission Passengers: {selectedMission?.passengers?.length || 0}</p>
          <p>Selected Mission Type: {selectedMission ? typeof selectedMission : 'None'}</p>
        </div>
      </div>

      {/* Mission Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Missions</p>
                             <p className="text-2xl font-semibold text-gray-900">{Array.isArray(missions) ? missions.length : 0}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
                             <p className="text-2xl font-semibold text-gray-900">
                 {Array.isArray(missions) ? missions.filter(m => m.status === 'ACTIVE').length : 0}
               </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Planned</p>
                             <p className="text-2xl font-semibold text-gray-900">
                 {Array.isArray(missions) ? missions.filter(m => m.status === 'PLANNED').length : 0}
               </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk</p>
                             <p className="text-2xl font-semibold text-gray-900">
                 {Array.isArray(missions) ? missions.filter(m => m.overallRisk > 0.6).length : 0}
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(missions) ? missions.map(mission => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAssignPassengers={handleAssignPassengers}
            onRiskAssessment={handleRiskAssessment}
            onOptimizeRoute={handleOptimizeRoute}
          />
        )) : []}
      </div>

             {(!Array.isArray(missions) || missions.length === 0) && (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No missions</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new mission.</p>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <MissionForm
          mission={editingMission}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingMission(null);
          }}
        />
      )}

      {showPassengerModal && selectedMission && (
        <PassengerAssignmentModal
          mission={selectedMission}
          passengers={passengers}
          onAssign={handleAssignPassenger}
          onRemove={handleRemovePassenger}
          onClose={() => {
            setShowPassengerModal(false);
            setSelectedMission(null);
          }}
        />
      )}

      {showRiskModal && (
        <RiskAssessmentModal
          mission={selectedMission}
          assessment={riskAssessment}
          onClose={() => {
            setShowRiskModal(false);
            setRiskAssessment(null);
          }}
        />
      )}

      {showRouteModal && (
        <RouteOptimizationModal
          mission={selectedMission}
          optimization={routeOptimization}
          passengers={passengers}
          onClose={() => {
            setShowRouteModal(false);
            setRouteOptimization(null);
          }}
        />
      )}
    </div>
  );
};

export default Missions; 