import React, { createContext, useContext, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { useSocket } from '../hooks/useSocket';

export const SocketContex = createContext();

export const SocketProvider = ({ children }) => {
  const { socket, online, conectarSocket, desconectarSocket } = useSocket(
    'http://localhost:8080'
  );

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.logged) {
      conectarSocket();
    }
  }, [auth, conectarSocket]);
  useEffect(() => {
    if (!auth.logged) {
      desconectarSocket();
    }
  }, [auth, desconectarSocket]);
  // Escuchar los cambios en los usuarios conectados

  useEffect(() => {
    socket?.on('lista-usuarios', (usuarios) => {
      console.log(usuarios);
    });
  }, [socket]);
  return (
    <SocketContex.Provider value={{ socket, online }}>
      {children}
    </SocketContex.Provider>
  );
};
