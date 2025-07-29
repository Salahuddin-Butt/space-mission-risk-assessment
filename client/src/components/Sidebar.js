import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Rocket, 
  Shield, 
  Brain,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const Sidebar = () => {
  const { isConnected } = useSocket();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/passengers', label: 'Passengers', icon: Users },
    { path: '/missions', label: 'Missions', icon: Rocket },
    { path: '/risk-assessment', label: 'Risk Assessment', icon: Shield },
    { path: '/ai-insights', label: 'AI Insights', icon: Brain },
  ];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white shadow-lg border-r border-gray-200"
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Mission Risk</h1>
            <p className="text-sm text-gray-500">Assessment System</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            AI-Powered Risk Assessment
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Version 1.0.0
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 