/**
 * Tarjeta de un registro devuelto por la API.
 *
 * Muestra solo los campos que identifican el registro; el detalle
 * completo se abre en una hoja inferior al tocarla.
 */
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colores, espaciado, radios, sombras, tipografia } from '../theme/colores';

export default function TarjetaRegistro({ registro, definicion, posicion, alAbrir }) {
  const colorInsignia = colores[definicion.colorInsignia(registro)] ?? colores.textoSuave;

  return (
    <Pressable
      style={({ pressed }) => [estilos.tarjeta, pressed && estilos.presionada]}
      onPress={() => alAbrir(registro)}
      accessibilityRole="button"
      accessibilityLabel={`${definicion.titulo(registro)}. Toca para ver todos los datos`}
    >
      <View style={estilos.cabecera}>
        <View style={estilos.indice}>
          <Text style={estilos.indiceTexto}>{posicion}</Text>
        </View>
        <View style={estilos.tituloBloque}>
          <Text style={estilos.titulo} numberOfLines={1}>{definicion.titulo(registro)}</Text>
          <Text style={estilos.subtitulo} numberOfLines={1}>{definicion.subtitulo(registro)}</Text>
        </View>
        <View style={estilos.valorBloque}>
          <Text style={estilos.valor}>{definicion.valor(registro)}</Text>
          <Text style={estilos.etiquetaValor}>{definicion.etiquetaValor}</Text>
        </View>
      </View>

      <View style={estilos.datos}>
        {definicion.resumen.map((campo) => (
          <View key={campo.clave} style={estilos.dato}>
            <Text style={estilos.clave}>{campo.clave}</Text>
            <Text style={estilos.dvalor} numberOfLines={1}>{campo.valor(registro)}</Text>
          </View>
        ))}
      </View>

      <View style={estilos.pie}>
        <View style={[estilos.insignia, { backgroundColor: colorInsignia + '18' }]}>
          <View style={[estilos.punto, { backgroundColor: colorInsignia }]} />
          <Text style={[estilos.insigniaTexto, { color: colorInsignia }]}>
            {definicion.insignia(registro)}
          </Text>
        </View>
        <View style={estilos.verMas}>
          <Text style={estilos.verMasTexto}>Ver todos los datos</Text>
          <Ionicons name="chevron-forward" size={14} color={colores.marcaOscuro} />
        </View>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie, borderRadius: radios.lg,
    padding: espaciado.lg, marginBottom: espaciado.md, ...sombras.tarjeta,
  },
  presionada: { backgroundColor: colores.superficieAlt, transform: [{ scale: 0.99 }] },
  cabecera: { flexDirection: 'row', alignItems: 'flex-start', gap: espaciado.md },
  indice: {
    width: 28, height: 28, borderRadius: radios.sm, backgroundColor: colores.superficieAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  indiceTexto: { ...tipografia.micro, color: colores.textoSuave },
  tituloBloque: { flex: 1 },
  titulo: { ...tipografia.tarjetaTitulo, color: colores.tinta },
  subtitulo: { ...tipografia.detalle, color: colores.textoSuave, marginTop: 2 },
  valorBloque: { alignItems: 'flex-end' },
  valor: { fontSize: 17, fontWeight: '700', color: colores.marcaOscuro, letterSpacing: -0.3 },
  etiquetaValor: {
    fontSize: 9.5, fontWeight: '700', color: colores.textoTenue,
    textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 1,
  },
  datos: {
    marginTop: espaciado.md, backgroundColor: colores.superficieAlt, borderRadius: radios.md,
    paddingHorizontal: espaciado.md, paddingVertical: espaciado.sm,
  },
  dato: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    gap: espaciado.lg, paddingVertical: 5,
  },
  clave: { ...tipografia.detalle, color: colores.textoSuave },
  dvalor: { ...tipografia.detalle, fontWeight: '700', color: colores.texto, flexShrink: 1, textAlign: 'right' },
  pie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: espaciado.md },
  insignia: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.sm - 2,
    borderRadius: radios.completo, paddingHorizontal: espaciado.md, paddingVertical: 5,
  },
  punto: { width: 6, height: 6, borderRadius: radios.completo },
  insigniaTexto: { ...tipografia.micro, fontSize: 11.5 },
  verMas: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  verMasTexto: { ...tipografia.micro, color: colores.marcaOscuro },
});
