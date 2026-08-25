/**
 * Contexto de autenticacion.
 *
 * El ingreso se valida contra la API de Django (POST /api/login/),
 * que devuelve el nombre y el rol del usuario.
 */
import { createContext, useContext, useState } from 'react';

import { enviarApi } from '../api/cliente';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  async function iniciarSesion(nombreUsuario, clave) {
    try {
      const respuesta = await enviarApi('/login/', {
        usuario: nombreUsuario,
        clave,
      });

      setUsuario({
        id: respuesta.id,
        usuario: respuesta.usuario,
        nombre: respuesta.nombre,
        correo: respuesta.correo,
        rol: respuesta.rol,
        idCliente: respuesta.id_cliente,
      });

      return { ok: true };

    } catch (error) {
      // La API devuelve 400 cuando las credenciales no coinciden.
      const detalle = error.datos?.detalle;
      const mensaje = Array.isArray(detalle) ? detalle[0] : detalle;
      return { ok: false, mensaje: mensaje || error.message };
    }
  }

  function cerrarSesion() {
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return contexto;
}
