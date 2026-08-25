/** Estados en los que no hay datos que mostrar. */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colores, espaciado, radios, tipografia } from '../theme/colores';

const CONTENIDOS = {
  inicial: {
    icono: 'cloud-download-outline', fondo: colores.marcaClaro, color: colores.marca,
    titulo: 'Listo para consultar',
    texto: 'Elige un filtro si lo necesitas y presiona el boton Consulta.',
  },
  error: {
    icono: 'cloud-offline-outline', fondo: colores.errorClaro, color: colores.error,
    titulo: 'No se pudo consultar',
  },
  vacio: {
    icono: 'file-tray-outline', fondo: colores.superficieAlt, color: colores.textoSuave,
    titulo: 'Sin resultados',
    texto: 'La consulta se realizo correctamente, pero no hay registros con ese filtro.',
  },
};

export default function EstadoConsulta({ situacion, mensaje, onReintentar }) {
  const c = CONTENIDOS[situacion];
  if (!c) return null;

  return (
    <View style={estilos.caja}>
      <View style={[estilos.circulo, { backgroundColor: c.fondo }]}>
        <Ionicons name={c.icono} size={30} color={c.color} />
      </View>
      <Text style={estilos.titulo}>{c.titulo}</Text>
      <Text style={estilos.texto}>{c.texto ?? mensaje}</Text>

      {situacion === 'error' && onReintentar ? (
        <Pressable
          style={({ pressed }) => [estilos.boton, pressed && { opacity: 0.6 }]}
          onPress={() => onReintentar()}
          accessibilityRole="button"
          accessibilityLabel="Reintentar la consulta"
        >
          <Ionicons name="refresh" size={15} color={colores.error} />
          <Text style={estilos.botonTexto}>Reintentar</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caja: { alignItems: 'center', gap: espaciado.md, paddingVertical: espaciado.xxl + 20, paddingHorizontal: espaciado.xxl },
  circulo: { width: 72, height: 72, borderRadius: radios.completo, alignItems: 'center', justifyContent: 'center', marginBottom: espaciado.xs },
  titulo: { ...tipografia.tarjetaTitulo, color: colores.tinta, textAlign: 'center' },
  texto: { ...tipografia.detalle, lineHeight: 20, color: colores.textoSuave, textAlign: 'center' },
  boton: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.sm, marginTop: espaciado.sm,
    borderWidth: 1.5, borderColor: colores.error, borderRadius: radios.completo,
    paddingHorizontal: espaciado.xl, paddingVertical: 10,
  },
  botonTexto: { color: colores.error, fontWeight: '700', fontSize: 14 },
});
