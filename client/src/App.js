import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Passengers from './pages/Passengers';
import Missions from './pages/Missions';
import RiskAssessment from './pages/RiskAssessment';
import AIInsights from './pages/AIInsights';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  return (
    <SocketProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/passengers" element={<Passengers />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/risk-assessment" element={<RiskAssessment />} />
              <Route path="/ai-insights" element={<AIInsights />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </SocketProvider>
  );
}

export default App; 