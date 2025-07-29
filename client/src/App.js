import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Passengers from './pages/Passengers';
import Missions from './pages/Missions';
import RiskAssessment from './pages/RiskAssessment';
import AIInsights from './pages/AIInsights';
import Demo from './pages/Demo';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  const [backendAvailable, setBackendAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if backend is available
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/health', { 
          method: 'GET',
          timeout: 3000 
        });
        if (response.ok) {
          setBackendAvailable(true);
        } else {
          setBackendAvailable(false);
        }
      } catch (error) {
        console.log('Backend not available, showing demo mode');
        setBackendAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBackend();
  }, []);

  // Show loading spinner while checking backend
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Space Mission Risk Assessment...</p>
        </div>
      </div>
    );
  }

  // Show demo if backend is not available
  if (!backendAvailable) {
    return <Demo />;
  }

  // Show full app if backend is available
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