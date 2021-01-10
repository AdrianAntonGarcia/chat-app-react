import { types } from '../../types/types';

export const chatReducer = (state, action) => {
  switch (action.type) {
    case types.usuariosCargados:
      return { ...state, usuarios: action.payload };
    case types.activarChat:
      // Por si clicamos en el mismo
      if (state.chatActivo === action.payload) {
        return state;
      }
      return { ...state, chatActivo: action.payload, mensajes: [] };
    default:
      return state;
  }
};
