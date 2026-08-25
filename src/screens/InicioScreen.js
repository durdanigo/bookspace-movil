/**
 * Pantalla HOME: tablero con los indicadores del sistema.
 *
 * Consume GET /api/dashboard/ y GET /api/reservas/?proximas=true
 */
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TarjetaIndicador from '../components/TarjetaIndicador';
import EstadoConsulta from '../components/EstadoConsulta';
import Esqueleto from '../components/Esqueleto';
import { consultarApi } from '../api/cliente';
import { URL_BASE } from '../api/config';
import { useAuth } from '../context/AuthContext';
import { colores, espaciado, radios, sombras, tipografia } from '../theme/colores';

/** Consulta un recurso simple que no devuelve listado. */
async function consultarPanel() {
  const respuesta = await fetch(URL_BASE + '/dashboard/', {
    headers: { Accept: 'application/json' },
  });
  if (!respuesta.ok) throw new Error('No se pudo obtener el tablero.');
  return respuesta.json();
}

export default function InicioScreen() {
  const { usuario } = useAuth();

  const [panel, setPanel] = useState(null);
  const [proximas, setProximas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizando, setActualizando] = useState(false);

  async function cargar(silencioso = false) {
    if (!silencioso) setCargando(true);
    setError('');

    try {
      const [datos, reservas] = await Promise.all([
        consultarPanel(),
        consultarApi('/reservas/', { proximas: 'true' }),
      ]);
      setPanel(datos);
      setProximas(reservas.registros.slice(0, 6));
    } catch (fallo) {
      setError(fallo.message);
      setPanel(null);
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

  const primerNombre = usuario?.nombre?.split(' ')[0] ?? 'usuario';

  return (
    <ScrollView
      contentContainerStyle={estilos.contenido}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={actualizando} onRefresh={alDeslizar} tintColor={colores.marca} />
      }
    >
      <View style={estilos.saludo}>
        <Text style={estilos.titulo}>Hola, {primerNombre}</Text>
        <Text style={estilos.subtitulo}>Estado general de la operacion</Text>
      </View>

      {cargando ? <Esqueleto cantidad={3} /> : null}

      {error ? (
        <EstadoConsulta situacion="error" mensaje={error} onReintentar={() => cargar()} />
      ) : null}

      {panel ? (
        <>
          <View style={estilos.rejilla}>
            <TarjetaIndicador
              etiqueta="Reservas de hoy" valor={String(panel.reservas_hoy)}
              detalle={`${panel.reservas_mes} en el mes`} icono="today-outline"
            />
            <TarjetaIndicador
              etiqueta="Ingresos del mes" valor={`$${Number(panel.ingresos_mes).toFixed(2)}`}
              detalle="Pagos confirmados" icono="cash-outline"
            />
            <TarjetaIndicador
              etiqueta="Pendientes" valor={String(panel.reservas_pendientes)}
              detalle="Esperan pago" icono="hourglass-outline" color={colores.alerta}
            />
            <TarjetaIndicador
              etiqueta="Espacios libres"
              valor={`${panel.espacios_disponibles}/${panel.total_espacios}`}
              detalle={`${panel.total_clientes} clientes activos`} icono="business-outline"
            />
          </View>

          {panel.espacios_mas_reservados?.length ? (
            <View style={estilos.bloque}>
              <Text style={estilos.tituloBloque}>Espacios mas reservados</Text>
              {panel.espacios_mas_reservados.map((fila) => (
                <View key={fila.codigo} style={estilos.fila}>
                  <View style={{ flex: 1 }}>
                    <Text style={estilos.filaTitulo}>{fila.nombre}</Text>
                    <Text style={estilos.filaDetalle}>{fila.codigo}</Text>
                  </View>
                  <Text style={estilos.filaValor}>{fila.total}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={estilos.bloque}>
            <Text style={estilos.tituloBloque}>Reservas por estado</Text>
            {panel.reservas_por_estado?.map((fila) => (
              <View key={fila.estado} style={estilos.fila}>
                <Text style={estilos.filaTitulo}>{fila.texto}</Text>
                <Text style={estilos.filaValor}>{fila.total}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {proximas.length ? (
        <View style={estilos.bloque}>
          <Text style={estilos.tituloBloque}>Proximas reservas</Text>
          {proximas.map((r) => (
            <View key={r.id_reserva} style={estilos.fila}>
              <View style={{ flex: 1 }}>
                <Text style={estilos.filaTitulo}>{r.espacio_nombre}</Text>
                <Text style={estilos.filaDetalle}>
                  {r.fecha} · {(r.hora_inicio || '').slice(0, 5)} · {r.cliente_nombre}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={estilos.filaValor}>${r.total}</Text>
                <Text style={[estilos.filaEstado, {
                  color: r.estado === 'CONFIRMADA' ? colores.marcaOscuro : colores.alerta,
                }]}>
                  {r.estado_texto}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      <View style={estilos.origen}>
        <Ionicons name="globe-outline" size={13} color={colores.textoTenue} />
        <Text style={estilos.origenTexto}>Datos en vivo desde la API de Django</Text>
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenido: { paddingHorizontal: espaciado.xl, paddingTop: espaciado.xl, paddingBottom: 110 },
  saludo: { marginBottom: espaciado.lg },
  titulo: { fontSize: 22, fontWeight: '700', color: colores.tinta, letterSpacing: -0.4 },
  subtitulo: { ...tipografia.detalle, color: colores.textoSuave, marginTop: 2 },
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: espaciado.md },
  bloque: {
    backgroundColor: colores.superficie, borderRadius: radios.lg,
    padding: espaciado.xl, marginTop: espaciado.lg, ...sombras.tarjeta,
  },
  tituloBloque: { ...tipografia.tarjetaTitulo, color: colores.tinta, marginBottom: espaciado.sm },
  fila: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    gap: espaciado.md, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: colores.superficieAlt,
  },
  filaTitulo: { ...tipografia.cuerpo, fontWeight: '600', color: colores.tinta },
  filaDetalle: { ...tipografia.micro, fontWeight: '500', color: colores.textoSuave, marginTop: 2 },
  filaValor: { fontSize: 15, fontWeight: '700', color: colores.marcaOscuro },
  filaEstado: { ...tipografia.micro, marginTop: 1 },
  origen: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: espaciado.sm, marginTop: espaciado.xl,
  },
  origenTexto: { ...tipografia.micro, fontWeight: '500', color: colores.textoTenue },
});
