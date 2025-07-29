import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Brain,
  Target,
  Activity,
  Clock,
  Users,
  Rocket
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { risksAPI, assessmentsAPI, missionsAPI, passengersAPI } from '../services/api';
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

const RiskAssessment = () => {
  const [selectedMission, setSelectedMission] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const queryClient = useQueryClient();

  // Fetch data - temporarily using useState instead of React Query
  const [risks, setRisks] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [missions, setMissions] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [assessmentStats, setAssessmentStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Fetch missions
    fetch('/api/missions')
      .then(res => res.json())
      .then(data => {
        console.log('RiskAssessment - Direct fetch missions:', data);
        setMissions(data);
      })
      .catch(err => {
        console.error('RiskAssessment - Direct fetch missions error:', err);
      });

    // Fetch other data
    Promise.all([
      fetch('/api/risks').then(res => res.json()),
      fetch('/api/assessments').then(res => res.json()),
      fetch('/api/passengers').then(res => res.json()),
      fetch('/api/risks/analysis/summary').then(res => res.json()).catch(() => null),
      fetch('/api/assessments/statistics/overview').then(res => res.json()).catch(() => null)
    ]).then(([risksData, assessmentsData, passengersData, riskAnalysisData, assessmentStatsData]) => {
      setRisks(risksData);
      setAssessments(assessmentsData);
      setPassengers(passengersData);
      setRiskAnalysis(riskAnalysisData);
      setAssessmentStats(assessmentStatsData);
      setIsLoading(false);
    }).catch(err => {
      console.error('RiskAssessment - Error fetching data:', err);
      setIsLoading(false);
    });
  }, []);

  // Create assessment function
  const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);

  const createAssessment = async (missionId) => {
    setIsCreatingAssessment(true);
    try {
      // Get the mission to find passenger IDs
      const mission = Array.isArray(missions) ? missions.find(m => m.id === missionId) : null;
      if (!mission) {
        toast.error('Mission not found');
        return;
      }

      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          missionId,
          passengerIds: mission.passengers || []
        }),
      });
      
      if (response.ok) {
        toast.success('Risk assessment created successfully');
        // Refresh all data
        const [assessmentsData, missionsData, risksData, riskAnalysisData, assessmentStatsData] = await Promise.all([
          fetch('/api/assessments').then(res => res.json()),
          fetch('/api/missions').then(res => res.json()),
          fetch('/api/risks').then(res => res.json()),
          fetch('/api/risks/analysis').then(res => res.json()),
          fetch('/api/assessments/stats').then(res => res.json())
        ]);
        setAssessments(assessmentsData);
        setMissions(missionsData);
        setRisks(risksData);
        setRiskAnalysis(riskAnalysisData);
        setAssessmentStats(assessmentStatsData);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create risk assessment');
      }
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast.error('Failed to create risk assessment');
    } finally {
      setIsCreatingAssessment(false);
    }
  };

  // Calculate risk metrics from actual assessments
  const totalAssessments = Array.isArray(assessments) ? assessments.length : 0;
  const totalPassengersAssessed = Array.isArray(assessments) ? 
    assessments.reduce((sum, assessment) => sum + (assessment.insights?.totalPassengers || 0), 0) : 0;
  
  // Calculate average risk from all assessments
  const averageRiskScore = Array.isArray(assessments) && assessments.length > 0 ? 
    assessments.reduce((sum, assessment) => sum + (assessment.insights?.averageRisk || 0), 0) / assessments.length : 0;

  // Calculate risk distribution from all assessments
  const riskDistribution = Array.isArray(assessments) ? 
    assessments.reduce((dist, assessment) => {
      const insights = assessment.insights;
      if (insights?.riskDistribution) {
        dist.low += insights.riskDistribution.low || 0;
        dist.medium += insights.riskDistribution.medium || 0;
        dist.high += insights.riskDistribution.high || 0;
      }
      return dist;
    }, { low: 0, medium: 0, high: 0 }) : { low: 0, medium: 0, high: 0 };

  // Prepare chart data from actual assessments
  const riskSeverityData = [
    { name: 'Low (1-3)', value: riskDistribution.low },
    { name: 'Medium (4-7)', value: riskDistribution.medium },
    { name: 'High (8-10)', value: riskDistribution.high },
  ];

  // Generate risk trend data from recent assessments (last 7 days)
  const generateRiskTrendData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    
    return days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      
      // Find assessments for this date
      const dayAssessments = Array.isArray(assessments) ? 
        assessments.filter(assessment => {
          const assessmentDate = new Date(assessment.createdAt);
          return assessmentDate.toDateString() === date.toDateString();
        }) : [];
      
      const avgRisk = dayAssessments.length > 0 ? 
        dayAssessments.reduce((sum, a) => sum + (a.insights?.averageRisk || 0), 0) / dayAssessments.length : 0;
      
      return {
        day,
        risk: avgRisk * 100, // Convert to percentage for display
        assessments: dayAssessments.length
      };
    });
  };

  const riskTrendData = generateRiskTrendData();

  // Get top risk factors from all assessments
  const getAllTopRiskFactors = () => {
    if (!Array.isArray(assessments)) return [];
    
    const allFactors = assessments.flatMap(assessment => 
      assessment.insights?.topRiskFactors || []
    );
    
    // Group by factor name and calculate average
    const factorMap = {};
    allFactors.forEach(factor => {
      if (!factorMap[factor.factor]) {
        factorMap[factor.factor] = { sum: 0, count: 0 };
      }
      factorMap[factor.factor].sum += factor.averageValue;
      factorMap[factor.factor].count += 1;
    });
    
    return Object.entries(factorMap)
      .map(([factor, data]) => ({
        factor,
        averageValue: data.sum / data.count
      }))
      .sort((a, b) => b.averageValue - a.averageValue)
      .slice(0, 5);
  };

  const topRisks = getAllTopRiskFactors();

  // Generate risk category data from assessments
  const generateRiskCategoryData = () => {
    if (!Array.isArray(assessments) || assessments.length === 0) {
      return [];
    }

    // Get all risk factors from assessments and group by category
    const categoryMap = {};
    assessments.forEach(assessment => {
      assessment.assessments?.forEach(passengerAssessment => {
        Object.entries(passengerAssessment.factors || {}).forEach(([factor, value]) => {
          // Map factors to categories
          let category = 'Other';
          if (factor.includes('health') || factor.includes('medical')) category = 'Health';
          else if (factor.includes('age')) category = 'Age';
          else if (factor.includes('experience')) category = 'Experience';
          else if (factor.includes('mission') || factor.includes('route')) category = 'Mission';
          else if (factor.includes('environment') || factor.includes('destination')) category = 'Environment';
          
          if (!categoryMap[category]) {
            categoryMap[category] = { sum: 0, count: 0 };
          }
          categoryMap[category].sum += value;
          categoryMap[category].count += 1;
        });
      });
    });

    return Object.entries(categoryMap)
      .map(([category, data]) => ({
        name: category,
        value: Math.round((data.sum / data.count) * 100) / 100
      }))
      .sort((a, b) => b.value - a.value);
  };

  const riskCategoryData = generateRiskCategoryData();

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const handleCreateAssessment = () => {
    if (!selectedMission) {
      toast.error('Please select a mission first');
      return;
    }
    
    const mission = Array.isArray(missions) ? missions.find(m => m.id === selectedMission) : null;
    if (!mission || mission.passengers.length === 0) {
      toast.error('Selected mission has no passengers');
      return;
    }

    createAssessment(selectedMission);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return '#10b981';
      case 'MEDIUM': return '#f59e0b';
      case 'HIGH': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Assessment</h1>
          <p className="text-gray-600">AI-powered risk evaluation and monitoring</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedMission}
            onChange={(e) => setSelectedMission(e.target.value)}
            className="input-field max-w-xs"
          >
            <option value="">Select mission for assessment</option>
            {Array.isArray(missions) ? missions.map((mission) => (
              <option key={mission.id} value={mission.id}>
                {mission.name} - {safeRender(mission.destination?.name)}
              </option>
            )) : []}
          </select>
          
          <button
            onClick={handleCreateAssessment}
            disabled={!selectedMission || isCreatingAssessment}
            className="btn-primary"
          >
            <Shield className="w-4 h-4 mr-2" />
            {isCreatingAssessment ? 'Creating...' : 'Create Assessment'}
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {['7d', '30d', '90d'].map((range) => (
          <button
            key={range}
            onClick={() => setSelectedTimeRange(range)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              selectedTimeRange === range
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Risk Factors"
          value={riskDistribution.low + riskDistribution.medium + riskDistribution.high}
          icon={AlertTriangle}
          color="bg-red-500"
          subtitle={`${totalPassengersAssessed} passengers assessed`}
        />
        <StatCard
          title="High Severity Risks"
          value={riskDistribution.high}
          icon={Shield}
          color="bg-orange-500"
          subtitle="Requires attention"
        />
        <StatCard
          title="Average Risk Score"
          value={`${(averageRiskScore * 100).toFixed(1)}%`}
          icon={TrendingUp}
          color="bg-blue-500"
          subtitle="Across all assessments"
        />
        <StatCard
          title="AI Assessments"
          value={totalAssessments}
          icon={Brain}
          color="bg-purple-500"
          subtitle="Neural network powered"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Severity Distribution */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskSeverityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Categories */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskCategoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Risk Trend and Top Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Trend */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Trend (7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="risk" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="assessments" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Risks */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Risk Factors</h3>
          <div className="space-y-3">
            {topRisks.length > 0 ? topRisks.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{risk.factor}</p>
                    <p className="text-sm text-gray-500">Risk factor</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {(risk.averageValue * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">Average impact</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <p>No risk factors available</p>
                <p className="text-sm">Create an assessment to see risk factors</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Assessments */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Risk Assessments</h3>
        <div className="space-y-3">
          {Array.isArray(assessments) ? assessments.slice(0, 5).map((assessment) => {
            const mission = Array.isArray(missions) ? missions.find(m => m.id === assessment.missionId) : null;
            const avgRisk = assessment.assessments?.reduce((sum, a) => sum + a.riskScore, 0) / assessment.assessments?.length || 0;
            
            return (
              <div key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {mission?.name || 'Unknown Mission'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {assessment.assessments?.length || 0} passengers assessed
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(assessment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {(avgRisk * 100).toFixed(1)}% avg risk
                  </p>
                  <p className="text-sm text-gray-500">
                    {assessment.assessmentType}
                  </p>
                </div>
              </div>
            );
          }) : []}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="card bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Risk Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Risk Patterns</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Age and health factors show strong correlation with risk levels</li>
              <li>• Weather conditions significantly impact mission risk assessment</li>
              <li>• Experience level has inverse relationship with risk probability</li>
              <li>• Distance and duration factors affect overall mission safety</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">AI Recommendations</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {Array.isArray(assessments) && assessments.length > 0 ? (
                assessments.flatMap(assessment => 
                  assessment.insights?.recommendations || []
                ).slice(0, 4).map((recommendation, index) => (
                  <li key={index}>• {recommendation}</li>
                ))
              ) : (
                <>
                  <li>• Consider weather conditions when planning missions</li>
                  <li>• Balance passenger experience levels across missions</li>
                  <li>• Monitor health scores for high-risk passengers</li>
                  <li>• Use genetic algorithms for optimal route planning</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
  };
  
export default RiskAssessment; 