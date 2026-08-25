/** Datos de la cuenta autenticada. */
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { URL_BASE } from '../api/config';
import { colores, espaciado, radios, sombras, tipografia } from '../theme/colores';

export default function PerfilScreen() {
  const { usuario, cerrarSesion } = useAuth();
  const inicial = (usuario?.nombre || 'U').charAt(0).toUpperCase();

  const datos = [
    { clave: 'Usuario', valor: usuario?.usuario },
    { clave: 'Correo', valor: usuario?.correo || 'Sin correo' },
    { clave: 'Rol', valor: usuario?.rol },
    { clave: 'Validado por', valor: 'API REST de Django' },
    { clave: 'Servidor', valor: URL_BASE.replace('https://', '') },
  ];

  return (
    <ScrollView contentContainerStyle={estilos.contenido} showsVerticalScrollIndicator={false}>
      <View style={estilos.saludo}>
        <Text style={estilos.titulo}>Mi perfil</Text>
        <Text style={estilos.subtitulo}>Datos de la cuenta</Text>
      </View>

      <View style={estilos.tarjeta}>
        <View style={estilos.cabecera}>
          <View style={estilos.avatar}>
            <Text style={estilos.avatarTexto}>{inicial}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={estilos.nombre}>{usuario?.nombre}</Text>
            <Text style={estilos.rol}>{usuario?.rol}</Text>
          </View>
        </View>

        {datos.map((d) => (
          <View key={d.clave} style={estilos.dato}>
            <Text style={estilos.clave}>{d.clave}</Text>
            <Text style={estilos.valor}>{d.valor}</Text>
          </View>
        ))}

        <Pressable
          style={({ pressed }) => [estilos.boton, pressed && { opacity: 0.6 }]}
          onPress={cerrarSesion}
          accessibilityRole="button"
          accessibilityLabel="Cerrar sesion"
        >
          <Ionicons name="log-out-outline" size={18} color={colores.error} />
          <Text style={estilos.botonTexto}>Cerrar sesion</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: { paddingHorizontal: espaciado.xl, paddingTop: espaciado.xl, paddingBottom: 110 },
  saludo: { marginBottom: espaciado.lg },
  titulo: { fontSize: 22, fontWeight: '700', color: colores.tinta, letterSpacing: -0.4 },
  subtitulo: { ...tipografia.detalle, color: colores.textoSuave, marginTop: 2 },
  tarjeta: {
    backgroundColor: colores.superficie, borderRadius: radios.lg,
    padding: espaciado.xl, ...sombras.tarjeta,
  },
  cabecera: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.lg,
    paddingBottom: espaciado.lg, borderBottomWidth: 1, borderBottomColor: colores.superficieAlt,
  },
  avatar: {
    width: 58, height: 58, borderRadius: radios.completo, backgroundColor: colores.marcaClaro,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTexto: { fontSize: 24, fontWeight: '700', color: colores.marcaOscuro },
  nombre: { fontSize: 18, fontWeight: '700', color: colores.tinta },
  rol: { ...tipografia.detalle, color: colores.textoSuave, marginTop: 2 },
  dato: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    gap: espaciado.lg, paddingVertical: espaciado.md,
    borderBottomWidth: 1, borderBottomColor: colores.superficieAlt,
  },
  clave: { ...tipografia.detalle, color: colores.textoSuave },
  valor: { ...tipografia.detalle, fontWeight: '700', color: colores.tinta, flexShrink: 1, textAlign: 'right' },
  boton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espaciado.sm,
    marginTop: espaciado.xl, borderWidth: 1.5, borderColor: colores.error,
    borderRadius: radios.sm, paddingVertical: 13,
  },
  botonTexto: { color: colores.error, ...tipografia.cuerpo, fontWeight: '700' },
});
