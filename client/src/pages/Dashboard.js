import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Rocket, 
  AlertTriangle,
  Brain,
  Activity,
  Target,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Fetch data using direct fetch calls
  const [passengers, setPassengers] = useState([]);
  const [missions, setMissions] = useState([]);
  const [risks, setRisks] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [assessmentStats, setAssessmentStats] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [
          passengersData,
          missionsData,
          risksData,
          assessmentsData,
          riskAnalysisData,
          assessmentStatsData,
          aiStatusData
        ] = await Promise.all([
          fetch('/api/passengers').then(res => res.json()),
          fetch('/api/missions').then(res => res.json()),
          fetch('/api/risks').then(res => res.json()),
          fetch('/api/assessments').then(res => res.json()),
          fetch('/api/risks/analysis/summary').then(res => res.json()),
          fetch('/api/assessments/statistics/overview').then(res => res.json()),
          fetch('/api/assessments/ai/status').then(res => res.json())
        ]);

        setPassengers(Array.isArray(passengersData) ? passengersData : []);
        setMissions(Array.isArray(missionsData) ? missionsData : []);
        setRisks(Array.isArray(risksData) ? risksData : []);
        setAssessments(Array.isArray(assessmentsData) ? assessmentsData : []);
        setRiskAnalysis(riskAnalysisData);
        setAssessmentStats(assessmentStatsData);
        setAiStatus(aiStatusData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate dashboard metrics
  const totalPassengers = Array.isArray(passengers) ? passengers.length : 0;
  const activeMissions = Array.isArray(missions) ? missions.filter(m => m.status === 'ACTIVE').length : 0;
  const highRiskPassengers = Array.isArray(passengers) ? passengers.filter(p => {
    // Simulate risk calculation for demo
    const riskScore = (100 - p.healthScore) / 100 * 0.6 + (10 - p.experienceLevel) / 10 * 0.4;
    return riskScore > 0.7;
  }).length : 0;

  // Prepare chart data
  const riskDistributionData = [
    { name: 'Low Risk', value: assessmentStats?.riskDistribution?.low || 0, color: '#10b981' },
    { name: 'Medium Risk', value: assessmentStats?.riskDistribution?.medium || 0, color: '#f59e0b' },
    { name: 'High Risk', value: assessmentStats?.riskDistribution?.high || 0, color: '#ef4444' },
  ];

  const missionStatusData = [
    { name: 'Planned', value: Array.isArray(missions) ? missions.filter(m => m.status === 'PLANNED').length : 0 },
    { name: 'Active', value: Array.isArray(missions) ? missions.filter(m => m.status === 'ACTIVE').length : 0 },
    { name: 'Completed', value: Array.isArray(missions) ? missions.filter(m => m.status === 'COMPLETED').length : 0 },
    { name: 'Cancelled', value: Array.isArray(missions) ? missions.filter(m => m.status === 'CANCELLED').length : 0 },
  ];

  const riskTrendData = [
    { day: 'Mon', risk: 0.3 },
    { day: 'Tue', risk: 0.4 },
    { day: 'Wed', risk: 0.2 },
    { day: 'Thu', risk: 0.6 },
    { day: 'Fri', risk: 0.5 },
    { day: 'Sat', risk: 0.3 },
    { day: 'Sun', risk: 0.4 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last week
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const AIInsightCard = () => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
    >
      <div className="flex items-center space-x-3 mb-4">
        <Brain className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Model Status:</span>
          <span className={`text-sm font-medium ${
            aiStatus?.isTrained ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {aiStatus?.isTrained ? 'Trained' : 'Training'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Training Data:</span>
          <span className="text-sm font-medium text-gray-900">
            {aiStatus?.trainingDataSize || 0} samples
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Avg Confidence:</span>
          <span className="text-sm font-medium text-gray-900">
            {((assessmentStats?.averageConfidence || 0) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <button 
        onClick={async () => {
          try {
            const response = await fetch('/api/assessments/ai/retrain', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              toast.success('AI model retraining initiated');
            } else {
              const errorData = await response.json();
              toast.error(errorData.message || 'Failed to retrain AI model');
            }
          } catch (error) {
            console.error('AI retrain error:', error);
            toast.error('Failed to retrain AI model');
          }
        }}
        className="mt-4 w-full btn-primary"
      >
        Retrain AI Model
      </button>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mission Risk Dashboard</h1>
          <p className="text-gray-600">Real-time risk assessment and monitoring</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              // Refresh dashboard data
              const fetchDashboardData = async () => {
                setIsLoading(true);
                try {
                  const [
                    passengersData,
                    missionsData,
                    risksData,
                    assessmentsData,
                    riskAnalysisData,
                    assessmentStatsData,
                    aiStatusData
                  ] = await Promise.all([
                    fetch('/api/passengers').then(res => res.json()),
                    fetch('/api/missions').then(res => res.json()),
                    fetch('/api/risks').then(res => res.json()),
                    fetch('/api/assessments').then(res => res.json()),
                    fetch('/api/risks/analysis/summary').then(res => res.json()),
                    fetch('/api/assessments/statistics/overview').then(res => res.json()),
                    fetch('/api/assessments/ai/status').then(res => res.json())
                  ]);

                  setPassengers(Array.isArray(passengersData) ? passengersData : []);
                  setMissions(Array.isArray(missionsData) ? missionsData : []);
                  setRisks(Array.isArray(risksData) ? risksData : []);
                  setAssessments(Array.isArray(assessmentsData) ? assessmentsData : []);
                  setRiskAnalysis(riskAnalysisData);
                  setAssessmentStats(assessmentStatsData);
                  setAiStatus(aiStatusData);
                } catch (error) {
                  console.error('Error refreshing dashboard data:', error);
                } finally {
                  setIsLoading(false);
                }
              };
              fetchDashboardData();
            }}
            className="btn-secondary"
          >
            Refresh Data
          </button>
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Passengers"
          value={totalPassengers}
          icon={Users}
          color="bg-blue-500"
          trend={5}
        />
        <StatCard
          title="Active Missions"
          value={activeMissions}
          icon={Rocket}
          color="bg-green-500"
          trend={-2}
        />
        <StatCard
          title="High Risk Passengers"
          value={highRiskPassengers}
          icon={AlertTriangle}
          color="bg-red-500"
          trend={8}
        />
        <StatCard
          title="AI Assessments"
          value={assessmentStats?.totalAssessments || 0}
          icon={Brain}
          color="bg-purple-500"
          trend={12}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mission Status */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mission Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={missionStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Risk Trend and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="card lg:col-span-2"
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
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Insights */}
        <AIInsightCard />
      </div>

      {/* Recent Activity */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {Array.isArray(assessments) ? assessments.slice(0, 5).map((assessment) => (
            <div key={assessment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Activity className="w-4 h-4 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Risk assessment completed for mission
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(assessment.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {assessment.assessments?.length || 0} passengers
              </span>
            </div>
          )) : []}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 