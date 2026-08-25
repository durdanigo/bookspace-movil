/**
 * Estructura principal de la aplicacion.
 *
 * Integra las dos formas de navegacion:
 *   - Barra de pestanas inferior (TAB): Inicio, Reservas y Calendario.
 *   - Menu lateral (Drawer): todos los modulos del sistema.
 *
 * Ambas conviven sin conflicto porque comparten un unico estado de
 * seccion activa: al elegir una opcion del menu lateral que tambien
 * esta en las pestanas, la pestana correspondiente queda marcada.
 */
import { useState } from 'react';
import { View, Text, Pressable, StatusBar, SafeAreaView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import InicioScreen from './InicioScreen';
import ListadoScreen from './ListadoScreen';
import CalendarioScreen from './CalendarioScreen';
import RegistroScreen from './RegistroScreen';
import PerfilScreen from './PerfilScreen';
import MenuLateral from '../components/MenuLateral';
import BarraInferior from '../components/BarraInferior';
import BotonConsulta from '../components/BotonConsulta';
import ModalDetalle from '../components/ModalDetalle';
import { consultarApi } from '../api/cliente';
import { MODULOS } from '../api/config';
import { colores, espaciado, radios, tipografia } from '../theme/colores';

const ESTADO_INICIAL = {
  filtro: '', registros: [], total: 0, momento: '',
  situacion: 'inicial', mensajeError: '', actualizando: false,
};

/** Opciones del menu lateral. */
const OPCIONES_MENU = [
  { id: 'inicio', nombre: 'Tablero', icono: 'home-outline' },
  { id: 'reservas', nombre: 'Reservas', icono: 'calendar-outline' },
  { id: 'calendario', nombre: 'Calendario', icono: 'grid-outline' },
  { id: 'registro', nombre: 'Nueva reserva', icono: 'add-circle-outline' },
  { id: 'espacios', nombre: 'Espacios', icono: 'business-outline' },
  { id: 'tipos', nombre: 'Tipos de espacio', icono: 'layers-outline' },
  { id: 'servicios', nombre: 'Servicios', icono: 'cube-outline' },
  { id: 'clientes', nombre: 'Clientes', icono: 'people-outline' },
  { id: 'pagos', nombre: 'Pagos', icono: 'card-outline' },
  { id: 'perfil', nombre: 'Mi perfil', icono: 'person-outline' },
];

/** Pestanas de la barra inferior. */
const PESTANAS = [
  { id: 'inicio', nombre: 'Inicio', icono: 'home-outline', iconoLleno: 'home' },
  { id: 'reservas', nombre: 'Reservas', icono: 'calendar-outline', iconoLleno: 'calendar' },
  { id: 'calendario', nombre: 'Calendario', icono: 'grid-outline', iconoLleno: 'grid' },
];

const TITULOS = Object.fromEntries(OPCIONES_MENU.map((o) => [o.id, o.nombre]));

export default function PantallaPrincipal() {
  const [seccion, setSeccion] = useState('inicio');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [detalle, setDetalle] = useState(null);

  const [estados, setEstados] = useState(
    Object.fromEntries(Object.keys(MODULOS).map((id) => [id, { ...ESTADO_INICIAL }]))
  );

  const modulo = MODULOS[seccion];

  function actualizarEstado(id, cambios) {
    setEstados((prev) => ({ ...prev, [id]: { ...prev[id], ...cambios } }));
  }

  async function ejecutarConsulta(esRefresco = false) {
    if (!modulo) return;
    const id = modulo.id;

    actualizarEstado(id, {
      situacion: esRefresco ? estados[id].situacion : 'cargando',
      actualizando: esRefresco,
      mensajeError: '',
    });

    try {
      const parametros = modulo.parametroFiltro
        ? { [modulo.parametroFiltro]: estados[id].filtro }
        : {};

      const resultado = await consultarApi(modulo.ruta, parametros);

      actualizarEstado(id, {
        registros: resultado.registros,
        total: resultado.total,
        momento: new Date().toLocaleTimeString('es-EC'),
        situacion: resultado.registros.length === 0 ? 'vacio' : 'listo',
        actualizando: false,
      });
    } catch (error) {
      actualizarEstado(id, {
        registros: [], total: 0, mensajeError: error.message,
        situacion: 'error', actualizando: false,
      });
    }
  }

  function cambiarFiltro(valor) {
    actualizarEstado(modulo.id, { filtro: valor, registros: [], situacion: 'inicial' });
  }

  function irA(id) {
    setSeccion(id);
    setMenuAbierto(false);
  }

  function alRegistrarReserva() {
    actualizarEstado('reservas', { registros: [], situacion: 'inicial' });
  }

  /** Contenido segun la seccion activa. */
  function contenido() {
    if (seccion === 'inicio') return <InicioScreen />;
    if (seccion === 'calendario') return <CalendarioScreen />;
    if (seccion === 'registro') return <RegistroScreen alRegistrar={alRegistrarReserva} />;
    if (seccion === 'perfil') return <PerfilScreen />;

    return (
      <ListadoScreen
        modulo={modulo}
        estado={estados[modulo.id]}
        alCambiarFiltro={cambiarFiltro}
        alConsultar={ejecutarConsulta}
        alAbrirDetalle={setDetalle}
      />
    );
  }

  const conBotonConsulta = Boolean(modulo);

  return (
    <View style={estilos.pantalla}>
      <StatusBar barStyle="light-content" backgroundColor={colores.tinta} />

      {/* Encabezado con el boton del menu lateral */}
      <SafeAreaView style={estilos.encabezadoArea}>
        <View style={estilos.encabezado}>
          <Pressable
            style={({ pressed }) => [estilos.botonMenu, pressed && { opacity: 0.6 }]}
            onPress={() => setMenuAbierto(true)}
            accessibilityRole="button"
            accessibilityLabel="Abrir menu lateral"
          >
            <Ionicons name="menu" size={23} color={colores.superficie} />
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={estilos.titulo}>{TITULOS[seccion] ?? 'BookSpace'}</Text>
            <Text style={estilos.subtitulo}>BookSpace Manager</Text>
          </View>

          <Pressable
            style={({ pressed }) => [estilos.botonMenu, pressed && { opacity: 0.6 }]}
            onPress={() => irA('perfil')}
            accessibilityRole="button"
            accessibilityLabel="Mi perfil"
          >
            <Ionicons name="person-circle-outline" size={26} color={colores.superficie} />
          </Pressable>
        </View>
      </SafeAreaView>

      <View style={{ flex: 1 }}>
        {contenido()}

        {conBotonConsulta ? (
          <BotonConsulta
            onPress={() => ejecutarConsulta(false)}
            cargando={estados[modulo.id]?.situacion === 'cargando'}
          />
        ) : null}
      </View>

      {/* Navegacion por pestanas */}
      <BarraInferior pestanas={PESTANAS} activa={seccion} alCambiar={irA} />

      {/* Navegacion por menu lateral */}
      <MenuLateral
        visible={menuAbierto}
        opciones={OPCIONES_MENU}
        activa={seccion}
        alSeleccionar={irA}
        alCerrar={() => setMenuAbierto(false)}
      />

      <ModalDetalle
        visible={detalle !== null}
        registro={detalle}
        definicion={modulo}
        alCerrar={() => setDetalle(null)}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  encabezadoArea: { backgroundColor: colores.tinta },
  encabezado: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.md,
    paddingHorizontal: espaciado.lg,
    paddingTop: Platform.OS === 'android' ? espaciado.lg : espaciado.sm,
    paddingBottom: espaciado.lg,
  },
  botonMenu: {
    width: 38, height: 38, borderRadius: radios.sm,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  titulo: { color: colores.superficie, fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  subtitulo: { color: colores.textoTenue, ...tipografia.micro, fontWeight: '500', marginTop: 1 },
});
