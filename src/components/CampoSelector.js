/**
 * Campo de seleccion.
 *
 * Abre una hoja inferior con las opciones disponibles. Se prefiere a
 * un desplegable nativo porque su apariencia es igual en iOS y en
 * Android, y permite mostrar informacion adicional de cada opcion.
 */
import { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colores, espaciado, radios, tipografia } from '../theme/colores';

export default function CampoSelector({ etiqueta, opciones, valor, alSeleccionar, marcador, cargando }) {
  const [abierto, setAbierto] = useState(false);
  const elegida = opciones.find((o) => String(o.valor) === String(valor));

  return (
    <View style={estilos.grupo}>
      <Text style={estilos.etiqueta}>
        {etiqueta} <Text style={estilos.requerido}>*</Text>
      </Text>

      <Pressable
        style={({ pressed }) => [estilos.campo, pressed && { opacity: 0.7 }]}
        onPress={() => !cargando && setAbierto(true)}
        accessibilityRole="button"
        accessibilityLabel={`${etiqueta}: ${elegida ? elegida.texto : 'sin seleccionar'}`}
      >
        <Text style={[estilos.valor, !elegida && estilos.marcador]} numberOfLines={1}>
          {cargando ? 'Cargando...' : elegida ? elegida.texto : marcador}
        </Text>
        <Ionicons name="chevron-down" size={17} color={colores.textoSuave} />
      </Pressable>

      {elegida?.ayuda ? <Text style={estilos.ayuda}>{elegida.ayuda}</Text> : null}

      <Modal visible={abierto} animationType="slide" transparent onRequestClose={() => setAbierto(false)}>
        <Pressable style={estilos.fondo} onPress={() => setAbierto(false)} />
        <View style={estilos.hoja}>
          <View style={estilos.asa} />
          <Text style={estilos.tituloHoja}>{etiqueta}</Text>

          <ScrollView style={{ maxHeight: 340 }} showsVerticalScrollIndicator={false}>
            {opciones.map((o) => {
              const sel = String(o.valor) === String(valor);
              return (
                <Pressable
                  key={String(o.valor)}
                  style={({ pressed }) => [estilos.opcion, pressed && { backgroundColor: colores.superficieAlt }]}
                  onPress={() => { alSeleccionar(o.valor); setAbierto(false); }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: sel }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[estilos.opcionTexto, sel && estilos.opcionActiva]}>{o.texto}</Text>
                    {o.ayuda ? <Text style={estilos.opcionAyuda}>{o.ayuda}</Text> : null}
                  </View>
                  {sel ? <Ionicons name="checkmark-circle" size={20} color={colores.marca} /> : null}
                </Pressable>
              );
            })}
            {opciones.length === 0 ? (
              <Text style={estilos.vacio}>No hay opciones disponibles.</Text>
            ) : null}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { marginBottom: espaciado.lg },
  etiqueta: { ...tipografia.detalle, fontWeight: '700', color: colores.texto, marginBottom: 6 },
  requerido: { color: colores.error },
  campo: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.sm,
    borderWidth: 1, borderColor: colores.bordeFuerte, borderRadius: radios.sm,
    backgroundColor: colores.superficie, paddingHorizontal: espaciado.md, paddingVertical: 13,
  },
  valor: { flex: 1, ...tipografia.cuerpo, color: colores.tinta },
  marcador: { color: colores.textoTenue },
  ayuda: { ...tipografia.micro, color: colores.marcaOscuro, marginTop: 5 },
  fondo: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11,18,32,0.45)' },
  hoja: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: colores.superficie,
    borderTopLeftRadius: radios.lg + 6, borderTopRightRadius: radios.lg + 6,
    paddingBottom: espaciado.xxl + 8, paddingHorizontal: espaciado.xl,
  },
  asa: {
    alignSelf: 'center', width: 40, height: 4, borderRadius: radios.completo,
    backgroundColor: colores.bordeFuerte, marginTop: espaciado.md, marginBottom: espaciado.md,
  },
  tituloHoja: { ...tipografia.tarjetaTitulo, color: colores.tinta, marginBottom: espaciado.sm },
  opcion: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.md,
    paddingVertical: espaciado.md, borderBottomWidth: 1, borderBottomColor: colores.superficieAlt,
  },
  opcionTexto: { ...tipografia.cuerpo, color: colores.texto },
  opcionActiva: { color: colores.marcaOscuro, fontWeight: '700' },
  opcionAyuda: { ...tipografia.micro, color: colores.textoTenue, marginTop: 2 },
  vacio: { ...tipografia.detalle, color: colores.textoSuave, paddingVertical: espaciado.xl, textAlign: 'center' },
});
