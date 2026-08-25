/**
 * Calendario de reservas.
 *
 * Agrupa por dia las reservas que entrega la API y permite recorrer
 * la agenda tocando cada fecha.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, RefreshControl, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import EstadoConsulta from '../components/EstadoConsulta';
import Esqueleto from '../components/Esqueleto';
import { consultarApi } from '../api/cliente';
import { colores, espaciado, radios, sombras, tipografia } from '../theme/colores';

const DIAS = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];

export default function CalendarioScreen() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizando, setActualizando] = useState(false);
  const [diaActivo, setDiaActivo] = useState(null);

  async function cargar(silencioso = false) {
    if (!silencioso) setCargando(true);
    setError('');
    try {
      const resultado = await consultarApi('/reservas/', { proximas: 'true' });
      setReservas(resultado.registros);
    } catch (fallo) {
      setError(fallo.message);
      setReservas([]);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function alDeslizar() {
    setActualizando(true);
    await cargar(true);
    setActualizando(false);
  }

  const agenda = useMemo(() => {
    const mapa = {};
    reservas.forEach((r) => {
      if (!mapa[r.fecha]) mapa[r.fecha] = [];
      mapa[r.fecha].push(r);
    });
    return mapa;
  }, [reservas]);

  const fechas = Object.keys(agenda).sort().slice(0, 12);
  const seleccionada = diaActivo && agenda[diaActivo] ? diaActivo : fechas[0];
  const delDia = agenda[seleccionada] ?? [];

  function etiqueta(fecha) {
    const [a, m, d] = fecha.split('-').map(Number);
    const objeto = new Date(a, m - 1, d);
    return { nombre: DIAS[objeto.getDay()], numero: String(d).padStart(2, '0') };
  }

  return (
    <ScrollView
      contentContainerStyle={estilos.contenido}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={actualizando} onRefresh={alDeslizar} tintColor={colores.marca} />
      }
    >
      <View style={estilos.saludo}>
        <Text style={estilos.titulo}>Calendario</Text>
        <Text style={estilos.subtitulo}>Ocupacion de los espacios por dia</Text>
      </View>

      {cargando ? <Esqueleto cantidad={3} /> : null}

      {error ? <EstadoConsulta situacion="error" mensaje={error} onReintentar={() => cargar()} /> : null}

      {!cargando && !error && fechas.length === 0 ? (
        <EstadoConsulta situacion="vacio" />
      ) : null}

      {fechas.length > 0 ? (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilos.tira}>
            {fechas.map((fecha) => {
              const activo = fecha === seleccionada;
              const { nombre, numero } = etiqueta(fecha);
              return (
                <Pressable
                  key={fecha}
                  style={({ pressed }) => [estilos.dia, activo && estilos.diaActivo, pressed && { opacity: 0.7 }]}
                  onPress={() => setDiaActivo(fecha)}
                  accessibilityRole="button"
                  accessibilityLabel={`Reservas del ${fecha}`}
                  accessibilityState={{ selected: activo }}
                >
                  <Text style={[estilos.diaEtiqueta, activo && estilos.textoActivo]}>{nombre}</Text>
                  <Text style={[estilos.diaNumero, activo && estilos.textoActivo]}>{numero}</Text>
                  <View style={[estilos.contador, activo && estilos.contadorActivo]}>
                    <Text style={[estilos.contadorTexto, activo && estilos.textoActivo]}>
                      {agenda[fecha].length}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={estilos.bloque}>
            <Text style={estilos.tituloBloque}>Reservas del {seleccionada}</Text>

            {delDia.map((r) => (
              <View key={r.id_reserva} style={estilos.evento}>
                <View style={[estilos.marca, {
                  backgroundColor: r.estado === 'CONFIRMADA' ? colores.marca : colores.alerta,
                }]} />
                <View style={{ flex: 1 }}>
                  <Text style={estilos.eventoEspacio}>{r.espacio_nombre}</Text>
                  <Text style={estilos.eventoHora}>
                    {(r.hora_inicio || '').slice(0, 5)} - {(r.hora_fin || '').slice(0, 5)}
                    {'  ·  '}{r.cliente_nombre}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={estilos.eventoTotal}>${r.total}</Text>
                  <Text style={[estilos.eventoEstado, {
                    color: r.estado === 'CONFIRMADA' ? colores.marcaOscuro : colores.alerta,
                  }]}>
                    {r.estado_texto}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : null}

      <View style={estilos.origen}>
        <Ionicons name="globe-outline" size={13} color={colores.textoTenue} />
        <Text style={estilos.origenTexto}>GET /api/reservas/?proximas=true</Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: { paddingHorizontal: espaciado.xl, paddingTop: espaciado.xl, paddingBottom: 110 },
  saludo: { marginBottom: espaciado.lg },
  titulo: { fontSize: 22, fontWeight: '700', color: colores.tinta, letterSpacing: -0.4 },
  subtitulo: { ...tipografia.detalle, color: colores.textoSuave, marginTop: 2 },
  tira: { gap: espaciado.sm + 2, paddingBottom: espaciado.xs },
  dia: {
    width: 62, paddingVertical: 10, borderRadius: radios.md,
    backgroundColor: colores.superficie, alignItems: 'center', ...sombras.tarjeta,
  },
  diaActivo: { backgroundColor: colores.marca },
  diaEtiqueta: { ...tipografia.micro, fontWeight: '500', color: colores.textoSuave },
  diaNumero: { fontSize: 19, fontWeight: '700', color: colores.tinta, marginTop: 1 },
  textoActivo: { color: colores.superficie },
  contador: {
    marginTop: 4, borderRadius: radios.sm, backgroundColor: colores.superficieAlt,
    paddingHorizontal: 7, paddingVertical: 1,
  },
  contadorActivo: { backgroundColor: colores.marcaOscuro },
  contadorTexto: { fontSize: 11, fontWeight: '700', color: colores.texto },
  bloque: {
    backgroundColor: colores.superficie, borderRadius: radios.lg,
    padding: espaciado.xl, marginTop: espaciado.lg, ...sombras.tarjeta,
  },
  tituloBloque: { ...tipografia.tarjetaTitulo, color: colores.tinta, marginBottom: espaciado.sm },
  evento: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.md,
    paddingVertical: 11, borderTopWidth: 1, borderTopColor: colores.superficieAlt,
  },
  marca: { width: 4, height: 36, borderRadius: 2 },
  eventoEspacio: { ...tipografia.cuerpo, fontWeight: '600', color: colores.tinta },
  eventoHora: { ...tipografia.micro, fontWeight: '500', color: colores.textoSuave, marginTop: 2 },
  eventoTotal: { fontSize: 14, fontWeight: '700', color: colores.marcaOscuro },
  eventoEstado: { ...tipografia.micro, marginTop: 1 },
  origen: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: espaciado.sm, marginTop: espaciado.xl,
  },
  origenTexto: { ...tipografia.micro, fontWeight: '500', color: colores.textoTenue },
});
