/**
 * BookSpace Movil
 *
 * Aplicacion que consume los servicios web REST publicados por el
 * sistema BookSpace Manager desarrollado en Django.
 *
 * Muestra la pantalla de inicio de sesion mientras no haya un usuario
 * autenticado; luego presenta la estructura de navegacion completa.
 */
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import PantallaPrincipal from './src/screens/PantallaPrincipal';

function Raiz() {
  const { usuario } = useAuth();
  return usuario ? <PantallaPrincipal /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Raiz />
    </AuthProvider>
  );
}
