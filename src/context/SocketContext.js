import React, { createContext, useContext, useEffect } from 'react';

import { AuthContext } from '../auth/AuthContext';
import { ChatContext } from './chat/ChatContext';
import { useSocket } from '../hooks/useSocket';

import { types } from '../types/types';

export const SocketContex = createContext();

export const SocketProvider = ({ children }) => {
  const { socket, online, conectarSocket, desconectarSocket } = useSocket(
    'http://localhost:8080'
  );
  const { auth } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

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
      dispatch({
        type: types.usuariosCargados,
        payload: usuarios,
      });
    });
  }, [dispatch, socket]);

  // Escuchar mensaje personal
  useEffect(() => {
    socket?.on('mensaje-personal', (mensaje) => {
      dispatch({
        type: types.nuevoMensaje,
        payload: mensaje,
      });
    });
  }, [dispatch, socket]);
  return (
    <SocketContex.Provider value={{ socket, online }}>
      {children}
    </SocketContex.Provider>
  );
};
