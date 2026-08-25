/** Sistema de diseno: color, espaciado, tipografia y sombras. */
import { Platform } from 'react-native';

export const colores = {
  marca: '#0D9488', marcaOscuro: '#0F766E', marcaClaro: '#ECFDF5', marcaBorde: '#A7F3D0',
  tinta: '#0B1220', fondo: '#F5F7FA', superficie: '#FFFFFF', superficieAlt: '#F1F5F9',
  texto: '#334155', textoSuave: '#64748B', textoTenue: '#94A3B8',
  borde: '#E2E8F0', bordeFuerte: '#CBD5E1',
  error: '#DC2626', errorClaro: '#FEF2F2', alerta: '#D97706',
};

export const espaciado = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 };
export const radios = { sm: 10, md: 14, lg: 20, completo: 999 };

export const tipografia = {
  seccion: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  tarjetaTitulo: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  cuerpo: { fontSize: 14, fontWeight: '500' },
  detalle: { fontSize: 12.5, fontWeight: '500' },
  micro: { fontSize: 11, fontWeight: '600' },
};

export const sombras = {
  tarjeta: Platform.select({
    ios: { shadowColor: '#0B1220', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
    android: { elevation: 2 }, default: {},
  }),
  barra: Platform.select({
    ios: { shadowColor: '#0B1220', shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: -4 } },
    android: { elevation: 12 }, default: {},
  }),
  boton: Platform.select({
    ios: { shadowColor: '#0F766E', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } },
    android: { elevation: 5 }, default: {},
  }),
};
