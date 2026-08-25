/** Hoja inferior con todos los campos que devolvio la API. */
import { Modal, View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colores, espaciado, radios, tipografia } from '../theme/colores';
import { NOMBRES_CAMPOS } from '../api/config';

export default function ModalDetalle({ visible, registro, definicion, alCerrar }) {
  if (!registro || !definicion) return null;

  const campos = Object.entries(registro).filter(
    ([, valor]) => typeof valor !== 'object' || valor === null
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={alCerrar}>
      <Pressable style={estilos.fondo} onPress={alCerrar} accessibilityLabel="Cerrar" />

      <View style={estilos.hoja}>
        <View style={estilos.asa} />
        <View style={estilos.cabecera}>
          <View style={estilos.cabeceraTexto}>
            <Text style={estilos.seccion}>Registro completo</Text>
            <Text style={estilos.titulo} numberOfLines={1}>{definicion.titulo(registro)}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [estilos.cerrar, pressed && { opacity: 0.5 }]}
            onPress={alCerrar}
            accessibilityRole="button"
            accessibilityLabel="Cerrar detalle"
          >
            <Ionicons name="close" size={20} color={colores.texto} />
          </Pressable>
        </View>

        <ScrollView style={estilos.lista} contentContainerStyle={estilos.listaContenido} showsVerticalScrollIndicator={false}>
          <Text style={estilos.aviso}>{campos.length} campos devueltos por la API</Text>
          {campos.map(([clave, valor]) => (
            <View key={clave} style={estilos.campo}>
              <Text style={estilos.clave}>{NOMBRES_CAMPOS[clave] ?? clave}</Text>
              <Text style={estilos.valor} selectable>
                {valor === null || valor === '' ? '—' : String(valor)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  fondo: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11, 18, 32, 0.45)' },
  hoja: {
    position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '82%',
    backgroundColor: colores.superficie,
    borderTopLeftRadius: radios.lg + 6, borderTopRightRadius: radios.lg + 6,
    paddingBottom: espaciado.xxl,
  },
  asa: {
    alignSelf: 'center', width: 40, height: 4, borderRadius: radios.completo,
    backgroundColor: colores.bordeFuerte, marginTop: espaciado.md, marginBottom: espaciado.sm,
  },
  cabecera: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.md,
    paddingHorizontal: espaciado.xl, paddingBottom: espaciado.md,
    borderBottomWidth: 1, borderBottomColor: colores.borde,
  },
  cabeceraTexto: { flex: 1 },
  seccion: { ...tipografia.seccion, color: colores.textoTenue, textTransform: 'uppercase' },
  titulo: { ...tipografia.tarjetaTitulo, color: colores.tinta, marginTop: 2 },
  cerrar: {
    width: 34, height: 34, borderRadius: radios.completo, backgroundColor: colores.superficieAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  lista: { paddingHorizontal: espaciado.xl },
  listaContenido: { paddingBottom: espaciado.xl },
  aviso: { ...tipografia.micro, color: colores.textoTenue, paddingVertical: espaciado.md },
  campo: { paddingVertical: espaciado.md, borderBottomWidth: 1, borderBottomColor: colores.superficieAlt },
  clave: { ...tipografia.micro, color: colores.textoSuave, marginBottom: 3 },
  valor: { ...tipografia.cuerpo, color: colores.tinta },
});
