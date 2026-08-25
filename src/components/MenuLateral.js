/**
 * Menu lateral (Drawer).
 *
 * Se implementa con animaciones nativas de React Native: se desliza
 * desde el borde izquierdo sobre una capa oscura. Muestra los datos
 * del usuario autenticado, los modulos del sistema y la opcion de
 * cerrar sesion.
 */
import { useEffect, useRef } from 'react';
import {
  View, Text, Pressable, Animated, ScrollView, Dimensions,
  SafeAreaView, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { colores, espaciado, radios, tipografia } from '../theme/colores';

const ANCHO = Math.min(300, Dimensions.get('window').width * 0.82);

export default function MenuLateral({ visible, opciones, activa, alSeleccionar, alCerrar }) {
  const { usuario, cerrarSesion } = useAuth();

  const desplazamiento = useRef(new Animated.Value(-ANCHO)).current;
  const opacidad = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(desplazamiento, {
        toValue: visible ? 0 : -ANCHO,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(opacidad, {
        toValue: visible ? 1 : 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, desplazamiento, opacidad]);

  function confirmarSalida() {
    Alert.alert('Cerrar sesion', 'Deseas salir de la aplicacion?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => { alCerrar(); cerrarSesion(); } },
    ]);
  }

  if (!visible) return null;

  const inicial = (usuario?.nombre || 'U').charAt(0).toUpperCase();

  return (
    <View style={estilos.capa}>
      <Animated.View style={[estilos.fondo, { opacity: opacidad }]}>
        <Pressable style={{ flex: 1 }} onPress={alCerrar} accessibilityLabel="Cerrar menu" />
      </Animated.View>

      <Animated.View style={[estilos.panel, { transform: [{ translateX: desplazamiento }] }]}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Datos del usuario autenticado */}
          <View style={estilos.cabecera}>
            <View style={estilos.avatar}>
              <Text style={estilos.avatarTexto}>{inicial}</Text>
            </View>
            <Text style={estilos.nombre} numberOfLines={1}>{usuario?.nombre}</Text>
            <Text style={estilos.detalle} numberOfLines={1}>
              {usuario?.usuario} · {usuario?.rol}
            </Text>
          </View>

          <ScrollView style={estilos.lista} showsVerticalScrollIndicator={false}>
            <Text style={estilos.seccion}>Modulos del sistema</Text>

            {opciones.map((o) => {
              const sel = o.id === activa;
              return (
                <Pressable
                  key={o.id}
                  style={({ pressed }) => [
                    estilos.opcion,
                    sel && estilos.opcionActiva,
                    pressed && !sel && { backgroundColor: colores.superficieAlt },
                  ]}
                  onPress={() => alSeleccionar(o.id)}
                  accessibilityRole="button"
                  accessibilityLabel={o.nombre}
                  accessibilityState={{ selected: sel }}
                >
                  <Ionicons
                    name={o.icono}
                    size={19}
                    color={sel ? colores.marcaOscuro : colores.textoSuave}
                  />
                  <Text style={[estilos.opcionTexto, sel && estilos.opcionTextoActivo]}>
                    {o.nombre}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable
            style={({ pressed }) => [estilos.salir, pressed && { opacity: 0.6 }]}
            onPress={confirmarSalida}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesion"
          >
            <Ionicons name="log-out-outline" size={20} color={colores.error} />
            <Text style={estilos.salirTexto}>Cerrar sesion</Text>
          </Pressable>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const estilos = StyleSheet.create({
  capa: { ...StyleSheet.absoluteFillObject, zIndex: 100 },
  fondo: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11,18,32,0.5)' },
  panel: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: ANCHO,
    backgroundColor: colores.superficie,
  },
  cabecera: {
    backgroundColor: colores.tinta,
    paddingHorizontal: espaciado.xl,
    paddingTop: espaciado.xl,
    paddingBottom: espaciado.xl,
  },
  avatar: {
    width: 52, height: 52, borderRadius: radios.completo, backgroundColor: colores.marca,
    alignItems: 'center', justifyContent: 'center', marginBottom: espaciado.md,
  },
  avatarTexto: { color: colores.superficie, fontSize: 22, fontWeight: '700' },
  nombre: { color: colores.superficie, fontSize: 16, fontWeight: '700' },
  detalle: { color: colores.textoTenue, ...tipografia.micro, marginTop: 2 },
  lista: { flex: 1, paddingHorizontal: espaciado.md },
  seccion: {
    ...tipografia.seccion, color: colores.textoTenue, textTransform: 'uppercase',
    paddingHorizontal: espaciado.md, paddingTop: espaciado.lg, paddingBottom: espaciado.sm,
  },
  opcion: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.md,
    paddingHorizontal: espaciado.md, paddingVertical: 13,
    borderRadius: radios.sm, marginBottom: 2,
  },
  opcionActiva: { backgroundColor: colores.marcaClaro },
  opcionTexto: { ...tipografia.cuerpo, fontWeight: '600', color: colores.texto },
  opcionTextoActivo: { color: colores.marcaOscuro },
  salir: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.md,
    paddingHorizontal: espaciado.xl, paddingVertical: espaciado.xl,
    borderTopWidth: 1, borderTopColor: colores.borde,
  },
  salirTexto: { color: colores.error, ...tipografia.cuerpo, fontWeight: '700' },
});
