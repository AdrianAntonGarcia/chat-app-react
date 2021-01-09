import React, { createContext, useCallback, useState } from 'react';
import { fetchConToken, fetchSinToken } from '../helpers/fetch';

export const AuthContext = createContext();

const initialState = {
  uid: null,
  checking: true,
  logged: false,
  name: null,
  email: null,
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialState);

  /**
   * Función que llama para hacer el login del usuario.
   * Establece los valores del contexto del usuario, establece
   * el token en el localStorage y el logged como true
   * @param {*} email
   * @param {*} password
   */
  const login = async (email, password) => {
    const resp = await fetchSinToken('login', { email, password }, 'POST');

    if (resp.ok) {
      localStorage.setItem('token', resp.token);
      const { usuarioDB: usuario } = resp;
      setAuth({
        uid: usuario.uid,
        checking: false,
        logged: true,
        name: usuario.nombre,
        email: usuario.email,
      });
      console.log('Autenticado!');
    }

    return resp.ok;
  };
  /**
   * Función que llama para hacer el registro del usuario.
   * Establece los valores del contexto del usuario, establece
   * el token en el localStorage y el logged como true
   * @param {*} nombre
   * @param {*} email
   * @param {*} password
   */
  const register = async (nombre, email, password) => {
    const resp = await fetchSinToken(
      'login/new',
      { email, password, nombre },
      'POST'
    );
    console.log(resp);
    if (resp.ok) {
      localStorage.setItem('token', resp.token);
      const { usuario } = resp;
      setAuth({
        uid: usuario.uid,
        checking: false,
        logged: true,
        name: usuario.nombre,
        email: usuario.email,
      });
      console.log('Registrado!');
    }

    return { ok: resp.ok, error: resp.msg };
  };

  /**
   * Función que comprueba, si hay token, que el usuario siga siendo válido,
   * si lo es actualiza el token y pone el logged a true, si no lo pone a false.
   * Se ejecuta cuando arranca la aplicación o se refresca
   */
  const verificaToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    // Si el token no existe
    if (!token) {
      setAuth({
        checking: false,
        logged: false,
      });
      return false;
    }
    const resp = await fetchConToken('login/renew');
    if (resp.ok) {
      localStorage.setItem('token', resp.token);
      const { usuario } = resp;
      setAuth({
        uid: usuario.uid,
        checking: false,
        logged: true,
        name: usuario.nombre,
        email: usuario.email,
      });
      console.log('Autenticado!');
      return true;
    } else {
      setAuth({
        checking: false,
        logged: false,
      });
      return false;
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      checking: false,
      logged: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, register, verificaToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
