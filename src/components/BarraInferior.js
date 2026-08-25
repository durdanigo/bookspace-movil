/** Barra de navegacion inferior con las secciones principales. */
import { View, Text, Pressable, SafeAreaView, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colores, espaciado, radios, sombras, tipografia } from '../theme/colores';

export default function BarraInferior({ pestanas, activa, alCambiar }) {
  return (
    <View style={estilos.envoltura}>
      <SafeAreaView>
        <View style={estilos.barra}>
          {pestanas.map((p) => {
            const sel = p.id === activa;
            return (
              <Pressable
                key={p.id}
                style={estilos.pestana}
                onPress={() => alCambiar(p.id)}
                accessibilityRole="tab"
                accessibilityLabel={p.nombre}
                accessibilityState={{ selected: sel }}
              >
                <View style={[estilos.icono, sel && estilos.iconoActivo]}>
                  <Ionicons
                    name={sel ? p.iconoLleno : p.icono}
                    size={20}
                    color={sel ? colores.marcaOscuro : colores.textoTenue}
                  />
                </View>
                <Text style={[estilos.texto, sel && estilos.textoActivo]} numberOfLines={1}>
                  {p.nombre}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const estilos = StyleSheet.create({
  envoltura: {
    backgroundColor: colores.superficie,
    borderTopWidth: 1,
    borderTopColor: colores.borde,
    ...sombras.barra,
  },
  barra: {
    flexDirection: 'row',
    paddingTop: espaciado.sm,
    paddingBottom: Platform.OS === 'android' ? espaciado.md : espaciado.xs,
    paddingHorizontal: espaciado.xs,
  },
  pestana: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 2 },
  icono: { paddingHorizontal: espaciado.lg, paddingVertical: 4, borderRadius: radios.completo },
  iconoActivo: { backgroundColor: colores.marcaClaro },
  texto: { ...tipografia.micro, fontSize: 10, color: colores.textoTenue },
  textoActivo: { color: colores.marcaOscuro },
});
