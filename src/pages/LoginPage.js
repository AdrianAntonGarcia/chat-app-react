import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

import Swal from 'sweetalert2';

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: 'test1@test.com',
    password: '123456',
    rememberme: false,
  });

  useEffect(() => {
    const remembermeEmail = localStorage.getItem('email');
    if (remembermeEmail) {
      /**La función setForm también retorna el estado */
      setForm((form) => {
        return { ...form, rememberme: true, email: remembermeEmail };
      });
    }
  }, []);

  const onChange = ({ target }) => {
    const { name, value } = target;
    /**
     * Llaves cuadradas para que use el valor del name y no
     * cree una propiedad llamada name
     */
    setForm({
      ...form,
      [name]: value,
    });
  };

  const toggleCheck = () => {
    setForm({
      ...form,
      rememberme: !form.rememberme,
    });
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();

    form.rememberme
      ? localStorage.setItem('email', form.email)
      : localStorage.removeItem('email');
    const { email, password } = form;
    const ok = await login(email, password);
    if (!ok) {
      Swal.fire('Error', 'Verifique el usuario y contraseña', 'error');
    }
  };

  const todoOk = () => {
    return form.email.length > 0 && form.password.length > 0 ? true : false;
  };
  return (
    <form
      className="login100-form validate-form flex-sb flex-w"
      onSubmit={onSubmit}
    >
      <span className="login100-form-title mb-3">Chat - Ingreso</span>

      <div className="wrap-input100 validate-input mb-3">
        <input
          className="input100"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
        />
        <span className="focus-input100"></span>
      </div>

      <div className="wrap-input100 validate-input mb-3">
        <input
          className="input100"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
        <span className="focus-input100"></span>
      </div>

      <div className="row mb-3">
        <div className="col" onClick={() => toggleCheck()}>
          <input
            className="input-checkbox100"
            id="ckb1"
            type="checkbox"
            name="rememberme"
            checked={form.rememberme}
            readOnly
          />
          <label className="label-checkbox100">Recordarme</label>
        </div>

        <div className="col text-right">
          <Link to="/auth/register" className="txt1">
            Nueva cuenta?
          </Link>
        </div>
      </div>

      <div className="container-login100-form-btn m-t-17">
        <button
          type="submit"
          disabled={!todoOk()}
          className="login100-form-btn"
        >
          Ingresar
        </button>
      </div>
    </form>
  );
};
