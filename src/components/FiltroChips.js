/** Fichas de filtro desplazables horizontalmente. */
import { Text, ScrollView, Pressable, StyleSheet } from 'react-native';

import { colores, espaciado, radios, tipografia } from '../theme/colores';

export default function FiltroChips({ opciones, seleccionado, alCambiar }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.contenedor}>
      {opciones.map((o) => {
        const activo = o.valor === seleccionado;
        return (
          <Pressable
            key={o.valor || 'todos'}
            style={({ pressed }) => [estilos.ficha, activo && estilos.activa, pressed && { opacity: 0.6 }]}
            onPress={() => alCambiar(o.valor)}
            accessibilityRole="button"
            accessibilityLabel={`Filtrar por ${o.texto}`}
            accessibilityState={{ selected: activo }}
          >
            <Text style={[estilos.texto, activo && estilos.textoActivo]}>{o.texto}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { gap: espaciado.sm, paddingRight: espaciado.lg },
  ficha: {
    borderRadius: radios.completo,
    borderWidth: 1.5,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
    paddingHorizontal: espaciado.lg,
    paddingVertical: 9,
  },
  activa: { backgroundColor: colores.marcaClaro, borderColor: colores.marca },
  texto: { ...tipografia.detalle, fontWeight: '600', color: colores.textoSuave },
  textoActivo: { color: colores.marcaOscuro },
});
