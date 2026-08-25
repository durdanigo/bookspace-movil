/** Silueta animada que se muestra mientras llegan los datos. */
import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

import { colores, espaciado, radios, sombras } from '../theme/colores';

function Bloque({ ancho, alto = 12, opacidad }) {
  return <Animated.View style={[estilos.bloque, { width: ancho, height: alto, opacity: opacidad }]} />;
}

export default function Esqueleto({ cantidad = 4 }) {
  const pulso = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulso, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [pulso]);

  return (
    <View>
      {Array.from({ length: cantidad }).map((_, i) => (
        <View key={i} style={estilos.tarjeta}>
          <View style={estilos.fila}>
            <Bloque ancho={38} alto={38} opacidad={pulso} />
            <View style={estilos.columna}>
              <Bloque ancho="70%" alto={13} opacidad={pulso} />
              <Bloque ancho="45%" alto={10} opacidad={pulso} />
            </View>
            <Bloque ancho={54} alto={20} opacidad={pulso} />
          </View>
          <View style={estilos.pie}>
            <Bloque ancho="100%" alto={10} opacidad={pulso} />
            <Bloque ancho="60%" alto={10} opacidad={pulso} />
          </View>
        </View>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radios.lg,
    padding: espaciado.lg,
    marginBottom: espaciado.md,
    ...sombras.tarjeta,
  },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espaciado.md },
  columna: { flex: 1, gap: espaciado.sm },
  pie: { marginTop: espaciado.lg, gap: espaciado.sm },
  bloque: { backgroundColor: colores.superficieAlt, borderRadius: radios.sm },
});
