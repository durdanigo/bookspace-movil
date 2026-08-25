/** Boton flotante de la accion principal. */
import { Text, Pressable, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colores, espaciado, radios, sombras } from '../theme/colores';

export default function BotonConsulta({ onPress, cargando, texto = 'Consulta', icono = 'search' }) {
  return (
    <View style={estilos.zona} pointerEvents="box-none">
      <Pressable
        style={({ pressed }) => [
          estilos.boton,
          cargando && estilos.inactivo,
          pressed && !cargando && estilos.presionado,
        ]}
        onPress={onPress}
        disabled={cargando}
        accessibilityRole="button"
        accessibilityLabel={texto}
        accessibilityState={{ disabled: cargando }}
      >
        {cargando ? (
          <ActivityIndicator color={colores.superficie} size="small" />
        ) : (
          <Ionicons name={icono} size={19} color={colores.superficie} />
        )}
        <Text style={estilos.texto}>{cargando ? 'Procesando...' : texto}</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  zona: { position: 'absolute', right: espaciado.xl, bottom: espaciado.xl },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaciado.sm + 1,
    backgroundColor: colores.marca,
    borderRadius: radios.completo,
    paddingHorizontal: espaciado.xl + 2,
    paddingVertical: 15,
    ...sombras.boton,
  },
  inactivo: { backgroundColor: colores.marcaOscuro },
  presionado: { backgroundColor: colores.marcaOscuro, transform: [{ scale: 0.96 }] },
  texto: { color: colores.superficie, fontSize: 15.5, fontWeight: '700', letterSpacing: 0.2 },
});
