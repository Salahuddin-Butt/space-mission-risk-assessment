import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      toast.success('Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      toast.error('Disconnected from server');
    });

    // Listen for real-time updates
    newSocket.on('passenger-created', (passenger) => {
      toast.success(`New passenger added: ${passenger.name}`);
    });

    newSocket.on('passenger-updated', (passenger) => {
      toast.success(`Passenger updated: ${passenger.name}`);
    });

    newSocket.on('passenger-deleted', (data) => {
      toast.success('Passenger removed');
    });

    newSocket.on('mission-created', (mission) => {
      toast.success(`New mission created: ${mission.name}`);
    });

    newSocket.on('mission-updated', (mission) => {
      toast.success(`Mission updated: ${mission.name}`);
    });

    newSocket.on('mission-deleted', (data) => {
      toast.success('Mission deleted');
    });

    newSocket.on('risk-created', (risk) => {
      toast.success(`New risk factor added: ${risk.name}`);
    });

    newSocket.on('risk-updated', (risk) => {
      toast.success(`Risk factor updated: ${risk.name}`);
    });

    newSocket.on('risk-deleted', (data) => {
      toast.success('Risk factor deleted');
    });

    newSocket.on('assessment-created', (assessment) => {
      toast.success('New risk assessment completed');
    });

    newSocket.on('assessment-updated', (assessment) => {
      toast.success('Risk assessment updated');
    });

    newSocket.on('assessment-deleted', (data) => {
      toast.success('Risk assessment deleted');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinMission = (missionId) => {
    if (socket && isConnected) {
      socket.emit('join-mission', missionId);
    }
  };

  const emitRiskUpdate = (data) => {
    if (socket && isConnected) {
      socket.emit('risk-update', data);
    }
  };

  const emitPassengerUpdate = (data) => {
    if (socket && isConnected) {
      socket.emit('passenger-update', data);
    }
  };

  const value = {
    socket,
    isConnected,
    joinMission,
    emitRiskUpdate,
    emitPassengerUpdate,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 