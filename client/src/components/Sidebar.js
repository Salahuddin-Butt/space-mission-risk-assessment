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
      className="w-64 bg-white/15 shadow-2xl border-r-2 border-white/20"
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg pulse-glow">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white glow-text">Mission Risk</h1>
            <p className="text-sm text-blue-200 font-semibold">Assessment System</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl border-2 border-blue-400/30">
          <div className="flex items-center space-x-3">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-sm font-bold ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="w-6 h-6" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4 border-t-2 border-white/20 bg-gradient-to-r from-blue-500/10 to-purple-600/10">
        <div className="text-center">
          <p className="text-xs text-blue-200 font-semibold">
            AI-Powered Risk Assessment
          </p>
          <p className="text-xs text-blue-300 mt-1 font-medium">
            Version 1.0.0
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar; 