/**
 * Pantalla generica de listado.
 *
 * Sirve para los seis modulos del sistema: cada uno declara en la
 * configuracion su ruta, sus filtros y como presentar los datos, de
 * modo que no hace falta repetir esta pantalla por modulo.
 */
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import FiltroChips from '../components/FiltroChips';
import EstadoConsulta from '../components/EstadoConsulta';
import TarjetaRegistro from '../components/TarjetaRegistro';
import Esqueleto from '../components/Esqueleto';
import { URL_BASE } from '../api/config';
import { colores, espaciado, radios, sombras, tipografia } from '../theme/colores';

export default function ListadoScreen({ modulo, estado, alCambiarFiltro, alConsultar, alAbrirDetalle }) {
  const { filtro, registros, total, momento, situacion, mensajeError, actualizando } = estado;
  const hayResultados = situacion === 'listo';
  const direccion = URL_BASE + modulo.ruta + (filtro ? `?${modulo.parametroFiltro}=${filtro}` : '');

  const encabezado = (
    <View>
      <View style={estilos.panel}>
        <View style={estilos.panelTitulo}>
          <View style={estilos.panelIcono}>
            <Ionicons name={modulo.icono} size={17} color={colores.marcaOscuro} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={estilos.tituloModulo}>{modulo.nombre}</Text>
            <Text style={estilos.ayuda}>{modulo.descripcion}</Text>
          </View>
        </View>

        {modulo.filtros.length > 0 ? (
          <>
            <Text style={estilos.seccion}>Filtrar</Text>
            <FiltroChips opciones={modulo.filtros} seleccionado={filtro} alCambiar={alCambiarFiltro} />
          </>
        ) : null}

        <View style={estilos.direccion}>
          <Ionicons name="globe-outline" size={13} color={colores.textoTenue} />
          <Text style={estilos.direccionTexto} numberOfLines={1}>
            {direccion.replace('https://', '')}
          </Text>
        </View>
      </View>

      {situacion === 'cargando' ? <Esqueleto cantidad={4} /> : null}

      {situacion !== 'listo' && situacion !== 'cargando' ? (
        <EstadoConsulta situacion={situacion} mensaje={mensajeError} onReintentar={alConsultar} />
      ) : null}

      {hayResultados ? (
        <View style={estilos.resumen}>
          <View style={estilos.resumenIcono}>
            <Ionicons name="checkmark" size={15} color={colores.marcaOscuro} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={estilos.resumenTotal}>
              {total} registro{total === 1 ? '' : 's'} encontrado{total === 1 ? '' : 's'}
            </Text>
            <Text style={estilos.resumenDetalle}>
              Mostrando {registros.length} · consultado a las {momento}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      data={hayResultados ? registros : []}
      keyExtractor={(item) => String(item[modulo.clave])}
      ListHeaderComponent={encabezado}
      renderItem={({ item, index }) => (
        <TarjetaRegistro registro={item} definicion={modulo} posicion={index + 1} alAbrir={alAbrirDetalle} />
      )}
      contentContainerStyle={estilos.lista}
      showsVerticalScrollIndicator={false}
      refreshControl={
        hayResultados ? (
          <RefreshControl refreshing={actualizando} onRefresh={() => alConsultar(true)} tintColor={colores.marca} />
        ) : undefined
      }
      ListFooterComponent={
        hayResultados ? (
          <Text style={estilos.pie}>Datos recuperados de la API REST de BookSpace Manager</Text>
        ) : null
      }
    />
  );
}

const estilos = StyleSheet.create({
  lista: { paddingHorizontal: espaciado.xl, paddingTop: espaciado.xl, paddingBottom: 110 },
  panel: {
    backgroundColor: colores.superficie, borderRadius: radios.lg,
    padding: espaciado.xl, marginBottom: espaciado.lg, ...sombras.tarjeta,
  },
  panelTitulo: { flexDirection: 'row', alignItems: 'center', gap: espaciado.md, marginBottom: espaciado.lg },
  panelIcono: {
    width: 36, height: 36, borderRadius: radios.md, backgroundColor: colores.marcaClaro,
    alignItems: 'center', justifyContent: 'center',
  },
  tituloModulo: { ...tipografia.tarjetaTitulo, color: colores.tinta },
  ayuda: { ...tipografia.detalle, color: colores.textoSuave, marginTop: 1 },
  seccion: {
    ...tipografia.seccion, color: colores.textoTenue,
    textTransform: 'uppercase', marginBottom: espaciado.md,
  },
  direccion: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.sm,
    backgroundColor: colores.superficieAlt, borderRadius: radios.sm,
    paddingHorizontal: espaciado.md, paddingVertical: espaciado.sm + 1, marginTop: espaciado.lg,
  },
  direccionTexto: { flex: 1, fontSize: 11, fontWeight: '600', color: colores.textoSuave },
  resumen: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.md,
    backgroundColor: colores.marcaClaro, borderRadius: radios.md, borderWidth: 1,
    borderColor: colores.marcaBorde, padding: espaciado.lg, marginBottom: espaciado.lg,
  },
  resumenIcono: {
    width: 26, height: 26, borderRadius: radios.completo, backgroundColor: colores.marcaBorde,
    alignItems: 'center', justifyContent: 'center',
  },
  resumenTotal: { fontSize: 15, fontWeight: '700', color: colores.marcaOscuro },
  resumenDetalle: { ...tipografia.micro, fontWeight: '500', color: colores.marcaOscuro, opacity: 0.75, marginTop: 1 },
  pie: { textAlign: 'center', fontSize: 11, color: colores.textoTenue, marginTop: espaciado.lg },
});
