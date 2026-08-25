/** Campo de texto con etiqueta. */
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../theme/colores';

export default function CampoTexto({
  etiqueta, valor, alCambiar, marcador, tipoTeclado = 'default',
  multilinea = false, requerido = false,
}) {
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.etiqueta}>
        {etiqueta}{requerido ? <Text style={estilos.requerido}> *</Text> : null}
      </Text>
      <TextInput
        style={[estilos.campo, multilinea && estilos.multilinea]}
        value={valor}
        onChangeText={alCambiar}
        placeholder={marcador}
        placeholderTextColor={colores.textoTenue}
        keyboardType={tipoTeclado}
        multiline={multilinea}
        accessibilityLabel={etiqueta}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: { marginBottom: espaciado.lg },
  etiqueta: { ...tipografia.detalle, fontWeight: '700', color: colores.texto, marginBottom: 6 },
  requerido: { color: colores.error },
  campo: {
    borderWidth: 1, borderColor: colores.bordeFuerte, borderRadius: radios.sm,
    backgroundColor: colores.superficie, paddingHorizontal: espaciado.md,
    paddingVertical: 13, ...tipografia.cuerpo, color: colores.tinta,
  },
  multilinea: { minHeight: 78, textAlignVertical: 'top' },
});
