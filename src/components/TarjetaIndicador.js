/** Tarjeta de indicador del tablero. */
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colores, espaciado, radios, sombras, tipografia } from '../theme/colores';

export default function TarjetaIndicador({ etiqueta, valor, detalle, icono, color }) {
  const tono = color ?? colores.marca;
  return (
    <View style={estilos.tarjeta}>
      <View style={[estilos.icono, { backgroundColor: tono + '18' }]}>
        <Ionicons name={icono} size={17} color={tono} />
      </View>
      <Text style={estilos.etiqueta}>{etiqueta}</Text>
      <Text style={[estilos.valor, { color: tono }]}>{valor}</Text>
      {detalle ? <Text style={estilos.detalle}>{detalle}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    flexGrow: 1, flexBasis: '46%',
    backgroundColor: colores.superficie, borderRadius: radios.lg,
    padding: espaciado.lg, ...sombras.tarjeta,
  },
  icono: {
    width: 32, height: 32, borderRadius: radios.sm,
    alignItems: 'center', justifyContent: 'center', marginBottom: espaciado.md,
  },
  etiqueta: {
    fontSize: 10, fontWeight: '700', color: colores.textoTenue,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },
  valor: { fontSize: 24, fontWeight: '700', marginTop: 2, letterSpacing: -0.5 },
  detalle: { ...tipografia.micro, fontWeight: '500', color: colores.textoSuave, marginTop: 1 },
});
