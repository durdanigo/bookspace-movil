/**
 * Registro de una nueva reserva.
 *
 * Envia los datos a POST /api/reservas/. Las reglas del negocio
 * (horario de atencion, capacidad del espacio y cruce de reservas)
 * se validan en el servidor, por lo que los mensajes que devuelve la
 * API se muestran tal cual al usuario.
 */
import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CampoSelector from '../components/CampoSelector';
import CampoTexto from '../components/CampoTexto';
import { consultarApi, enviarApi } from '../api/cliente';
import { colores, espaciado, radios, sombras, tipografia } from '../theme/colores';

/** Fecha de manana en formato AAAA-MM-DD. */
function fechaManana() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function RegistroScreen({ alRegistrar }) {
  const [clientes, setClientes] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  const [cliente, setCliente] = useState('');
  const [espacio, setEspacio] = useState('');
  const [fecha, setFecha] = useState(fechaManana());
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFin, setHoraFin] = useState('12:00');
  const [personas, setPersonas] = useState('1');
  const [observaciones, setObservaciones] = useState('');

  const [aviso, setAviso] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Carga los catalogos desde la API al abrir la pantalla.
  useEffect(() => {
    (async () => {
      try {
        const [resClientes, resEspacios] = await Promise.all([
          consultarApi('/clientes/'),
          consultarApi('/espacios/', { estado: 'DISPONIBLE' }),
        ]);

        setClientes(resClientes.registros.map((c) => ({
          valor: c.id_cliente,
          texto: c.nombre_completo,
          ayuda: c.tipo_cliente_texto,
        })));

        setEspacios(resEspacios.registros.map((e) => ({
          valor: e.id_espacio,
          texto: `${e.codigo} — ${e.nombre}`,
          ayuda: `${e.capacidad} personas · $${e.tarifa_hora} por hora`,
        })));

      } catch (error) {
        setAviso({ tipo: 'error', texto: 'No se pudieron cargar los catalogos: ' + error.message });
      } finally {
        setCargandoCatalogos(false);
      }
    })();
  }, []);

  async function guardar() {
    setAviso(null);

    if (!cliente || !espacio || !fecha) {
      setAviso({ tipo: 'error', texto: 'Completa el cliente, el espacio y la fecha.' });
      return;
    }

    setGuardando(true);

    try {
      const reserva = await enviarApi('/reservas/', {
        cliente,
        espacio,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        numero_personas: Number(personas) || 1,
        observaciones,
      });

      setAviso({
        tipo: 'ok',
        titulo: `Reserva ${reserva.codigo} registrada`,
        texto: `${reserva.horas} horas · Total $${reserva.total} · ${reserva.estado_texto}`,
      });

      setObservaciones('');
      if (alRegistrar) alRegistrar();

    } catch (error) {
      // La API devuelve los errores de validacion por campo.
      const detalle = error.datos && typeof error.datos === 'object'
        ? Object.entries(error.datos)
            .map(([, mensajes]) => (Array.isArray(mensajes) ? mensajes.join(' ') : String(mensajes)))
            .join('\n')
        : error.message;

      setAviso({ tipo: 'error', titulo: 'No se pudo registrar', texto: detalle });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={estilos.contenido} keyboardShouldPersistTaps="handled">

        <View style={estilos.tarjeta}>
          <View style={estilos.cabecera}>
            <View style={estilos.icono}>
              <Ionicons name="add-circle-outline" size={17} color={colores.marcaOscuro} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={estilos.titulo}>Nueva reserva</Text>
              <Text style={estilos.ayuda}>Los datos se envian a la API de Django</Text>
            </View>
          </View>

          {aviso ? (
            <View style={[estilos.aviso, aviso.tipo === 'ok' ? estilos.avisoOk : estilos.avisoError]}>
              <Ionicons
                name={aviso.tipo === 'ok' ? 'checkmark-circle' : 'alert-circle'}
                size={18}
                color={aviso.tipo === 'ok' ? colores.marcaOscuro : colores.error}
              />
              <View style={{ flex: 1 }}>
                {aviso.titulo ? (
                  <Text style={[estilos.avisoTitulo, { color: aviso.tipo === 'ok' ? colores.marcaOscuro : colores.error }]}>
                    {aviso.titulo}
                  </Text>
                ) : null}
                <Text style={[estilos.avisoTexto, { color: aviso.tipo === 'ok' ? colores.marcaOscuro : colores.error }]}>
                  {aviso.texto}
                </Text>
              </View>
            </View>
          ) : null}

          <CampoSelector
            etiqueta="Cliente"
            opciones={clientes}
            valor={cliente}
            alSeleccionar={setCliente}
            marcador="Selecciona un cliente"
            cargando={cargandoCatalogos}
          />

          <CampoSelector
            etiqueta="Espacio"
            opciones={espacios}
            valor={espacio}
            alSeleccionar={setEspacio}
            marcador="Selecciona un espacio"
            cargando={cargandoCatalogos}
          />

          <CampoTexto
            etiqueta="Fecha"
            valor={fecha}
            alCambiar={setFecha}
            marcador="AAAA-MM-DD"
            requerido
          />

          <View style={estilos.fila}>
            <View style={{ flex: 1 }}>
              <CampoTexto etiqueta="Hora de inicio" valor={horaInicio} alCambiar={setHoraInicio} marcador="09:00" requerido />
            </View>
            <View style={{ flex: 1 }}>
              <CampoTexto etiqueta="Hora de fin" valor={horaFin} alCambiar={setHoraFin} marcador="12:00" requerido />
            </View>
          </View>

          <CampoTexto
            etiqueta="Numero de personas"
            valor={personas}
            alCambiar={setPersonas}
            marcador="1"
            tipoTeclado="number-pad"
            requerido
          />

          <CampoTexto
            etiqueta="Observaciones"
            valor={observaciones}
            alCambiar={setObservaciones}
            marcador="Notas de la reserva"
            multilinea
          />

          <View style={estilos.nota}>
            <Ionicons name="information-circle-outline" size={15} color={colores.textoSuave} />
            <Text style={estilos.notaTexto}>
              El servidor valida el horario de atencion (07:00 a 22:00), la capacidad
              del espacio y que no exista otra reserva en el mismo horario.
            </Text>
          </View>

          {/* Accion principal del formulario */}
          <Pressable
            style={({ pressed }) => [
              estilos.boton,
              guardando && estilos.botonInactivo,
              pressed && !guardando && { opacity: 0.85 },
            ]}
            onPress={guardar}
            disabled={guardando}
            accessibilityRole="button"
            accessibilityLabel="Guardar reserva"
            accessibilityState={{ disabled: guardando }}
          >
            {guardando ? (
              <ActivityIndicator color={colores.superficie} size="small" />
            ) : (
              <Ionicons name="save-outline" size={19} color={colores.superficie} />
            )}
            <Text style={estilos.botonTexto}>
              {guardando ? 'Guardando...' : 'Guardar reserva'}
            </Text>
          </Pressable>
        </View>

        <Text style={estilos.pie}>POST /api/reservas/</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenido: { paddingHorizontal: espaciado.xl, paddingTop: espaciado.xl, paddingBottom: 110 },
  tarjeta: {
    backgroundColor: colores.superficie, borderRadius: radios.lg,
    padding: espaciado.xl, ...sombras.tarjeta,
  },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: espaciado.md, marginBottom: espaciado.xl },
  icono: {
    width: 36, height: 36, borderRadius: radios.md, backgroundColor: colores.marcaClaro,
    alignItems: 'center', justifyContent: 'center',
  },
  titulo: { ...tipografia.tarjetaTitulo, color: colores.tinta },
  ayuda: { ...tipografia.detalle, color: colores.textoSuave, marginTop: 1 },
  fila: { flexDirection: 'row', gap: espaciado.md },
  aviso: {
    flexDirection: 'row', gap: espaciado.md, borderRadius: radios.md,
    padding: espaciado.md, marginBottom: espaciado.lg, borderWidth: 1,
  },
  avisoOk: { backgroundColor: colores.marcaClaro, borderColor: colores.marcaBorde },
  avisoError: { backgroundColor: colores.errorClaro, borderColor: '#FECACA' },
  avisoTitulo: { ...tipografia.detalle, fontWeight: '700', marginBottom: 2 },
  avisoTexto: { ...tipografia.detalle, lineHeight: 18 },
  nota: {
    flexDirection: 'row', gap: espaciado.sm, backgroundColor: colores.superficieAlt,
    borderRadius: radios.sm, padding: espaciado.md,
  },
  notaTexto: { flex: 1, ...tipografia.micro, lineHeight: 16, color: colores.textoSuave },
  boton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: espaciado.sm + 1, backgroundColor: colores.marca,
    borderRadius: radios.sm, paddingVertical: 15, marginTop: espaciado.xl,
    ...sombras.boton,
  },
  botonInactivo: { backgroundColor: colores.marcaOscuro },
  botonTexto: { color: colores.superficie, fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
  pie: { textAlign: 'center', ...tipografia.micro, color: colores.textoTenue, marginTop: espaciado.lg },
});
