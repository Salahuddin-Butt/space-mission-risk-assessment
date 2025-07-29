import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, Rocket, Target, Activity, TrendingUp, AlertTriangle, 
  CheckCircle, Clock, Calendar, MapPin, Zap, Brain
} from 'lucide-react';

const Demo = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for demo
  const mockData = {
    missions: [
      { id: 1, name: "Mars Colony Mission", destination: "Mars", status: "Active", crewCount: 6, riskLevel: "Medium" },
      { id: 2, name: "Lunar Research", destination: "Moon", status: "Planning", crewCount: 4, riskLevel: "Low" },
      { id: 3, name: "Venus Exploration", destination: "Venus", status: "Completed", crewCount: 3, riskLevel: "High" }
    ],
    passengers: [
      { id: 1, name: "Dr. Sarah Johnson", age: 35, healthStatus: "Excellent", assignedMission: "Mars Colony Mission" },
      { id: 2, name: "Commander Mike Chen", age: 42, healthStatus: "Good", assignedMission: "Mars Colony Mission" },
      { id: 3, name: "Dr. Elena Rodriguez", age: 38, healthStatus: "Excellent", assignedMission: "Lunar Research" }
    ],
    riskData: [
      { name: 'Radiation', value: 65, color: '#ff6b6b' },
      { name: 'Microgravity', value: 45, color: '#4ecdc4' },
      { name: 'Isolation', value: 30, color: '#45b7d1' },
      { name: 'Technical', value: 25, color: '#96ceb4' }
    ],
    performanceData: [
      { month: 'Jan', accuracy: 85, efficiency: 78 },
      { month: 'Feb', accuracy: 88, efficiency: 82 },
      { month: 'Mar', accuracy: 92, efficiency: 85 },
      { month: 'Apr', accuracy: 89, efficiency: 88 },
      { month: 'May', accuracy: 94, efficiency: 91 },
      { month: 'Jun', accuracy: 96, efficiency: 93 }
    ]
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Missions" value="3" icon={Rocket} color="#3b82f6" />
        <StatCard title="Total Passengers" value="12" icon={Users} color="#10b981" />
        <StatCard title="Risk Assessments" value="8" icon={Target} color="#f59e0b" />
        <StatCard title="AI Accuracy" value="96%" icon={Brain} color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Mission Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockData.riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockData.riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMissions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Active Missions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockData.missions.map(mission => (
            <div key={mission.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{mission.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  mission.status === 'Active' ? 'bg-green-100 text-green-800' :
                  mission.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {mission.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Destination: {mission.destination}</p>
              <p className="text-sm text-gray-600 mb-2">Crew: {mission.crewCount} members</p>
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm text-gray-600">Risk: {mission.riskLevel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPassengers = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Passenger Roster</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Mission</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.passengers.map(passenger => (
                <tr key={passenger.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{passenger.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{passenger.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      passenger.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {passenger.healthStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{passenger.assignedMission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            AI Model Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Neural Network</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Genetic Algorithm</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Training Status</span>
              <span className="text-sm font-medium text-blue-600">Completed</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Accuracy</span>
                <span>96%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Efficiency</span>
                <span>93%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '93%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start p-3 bg-blue-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Optimize Crew Selection</p>
              <p className="text-sm text-blue-700">Consider health compatibility for long-duration missions</p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Route Optimization</p>
              <p className="text-sm text-green-700">Recommended fuel-efficient trajectory for Mars mission</p>
            </div>
          </div>
          <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Risk Mitigation</p>
              <p className="text-sm text-yellow-700">Enhanced radiation shielding recommended for Venus mission</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Space Mission Risk Assessment</h1>
              <p className="text-sm text-gray-600">AI-Powered Mission Planning & Risk Analysis</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              Demo Mode
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'missions', label: 'Missions', icon: Rocket },
              { id: 'passengers', label: 'Passengers', icon: Users },
              { id: 'ai-insights', label: 'AI Insights', icon: Brain }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'missions' && renderMissions()}
        {activeTab === 'passengers' && renderPassengers()}
        {activeTab === 'ai-insights' && renderAIInsights()}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Demo Information</h3>
          <p className="text-blue-800 mb-4">
            This is a demonstration of the Space Mission Risk Assessment system. 
            The full application requires a backend server to run all features including AI risk assessment, 
            real-time data updates, and mission management.
          </p>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• <strong>GitHub Repository:</strong> <a href="https://github.com/Salahuddin-Butt/space-mission-risk-assessment" className="underline">View Source Code</a></p>
            <p>• <strong>Full Stack Demo:</strong> Clone the repository and run <code className="bg-blue-100 px-1 rounded">npm start</code></p>
            <p>• <strong>Features:</strong> AI-powered risk assessment, mission planning, passenger management, real-time analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo; 