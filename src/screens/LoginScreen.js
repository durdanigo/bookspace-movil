/**
 * Pantalla de inicio de sesion.
 *
 * Las credenciales se validan contra la API de Django.
 */
import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { colores, espaciado, radios, sombras, tipografia } from '../theme/colores';

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();

  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function ingresar() {
    setError('');

    if (!usuario.trim() || !clave) {
      setError('Ingresa tu usuario y tu contrasena.');
      return;
    }

    setEnviando(true);
    const resultado = await iniciarSesion(usuario, clave);
    setEnviando(false);

    if (!resultado.ok) setError(resultado.mensaje);
  }

  return (
    <KeyboardAvoidingView
      style={estilos.pantalla}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">
        <View style={estilos.marca}>
          <View style={estilos.logo}>
            <Text style={estilos.logoTexto}>B</Text>
          </View>
          <Text style={estilos.titulo}>BookSpace</Text>
          <Text style={estilos.subtitulo}>Gestion de coworking</Text>
        </View>

        <View style={estilos.tarjeta}>
          <Text style={estilos.tituloTarjeta}>Iniciar sesion</Text>
          <Text style={estilos.ayudaTarjeta}>
            Tus credenciales se validan contra la API del sistema.
          </Text>

          <Text style={estilos.etiqueta}>Usuario</Text>
          <View style={estilos.campoIcono}>
            <Ionicons name="person-outline" size={18} color={colores.textoSuave} />
            <TextInput
              style={estilos.campo}
              value={usuario}
              onChangeText={setUsuario}
              placeholder="admin"
              placeholderTextColor={colores.textoTenue}
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Usuario"
            />
          </View>

          <Text style={estilos.etiqueta}>Contrasena</Text>
          <View style={estilos.campoIcono}>
            <Ionicons name="lock-closed-outline" size={18} color={colores.textoSuave} />
            <TextInput
              style={estilos.campo}
              value={clave}
              onChangeText={setClave}
              placeholder="••••••••"
              placeholderTextColor={colores.textoTenue}
              secureTextEntry
              accessibilityLabel="Contrasena"
            />
          </View>

          {error ? (
            <View style={estilos.aviso}>
              <Ionicons name="alert-circle-outline" size={16} color={colores.error} />
              <Text style={estilos.avisoTexto}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [estilos.boton, pressed && { opacity: 0.85 }]}
            onPress={ingresar}
            disabled={enviando}
            accessibilityRole="button"
            accessibilityLabel="Entrar"
          >
            {enviando ? (
              <ActivityIndicator color={colores.superficie} />
            ) : (
              <Text style={estilos.botonTexto}>Entrar</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.tinta },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: espaciado.xxl },
  marca: { alignItems: 'center', marginBottom: espaciado.xxl },
  logo: {
    width: 64, height: 64, borderRadius: radios.lg, backgroundColor: colores.marca,
    alignItems: 'center', justifyContent: 'center', marginBottom: espaciado.md,
  },
  logoTexto: { color: colores.superficie, fontSize: 30, fontWeight: '700' },
  titulo: { color: colores.superficie, fontSize: 30, fontWeight: '700' },
  subtitulo: { color: colores.textoTenue, fontSize: 14, marginTop: 2 },
  tarjeta: {
    backgroundColor: colores.superficie, borderRadius: radios.lg,
    padding: espaciado.xxl - 4, ...sombras.tarjeta,
  },
  tituloTarjeta: { fontSize: 20, fontWeight: '700', color: colores.tinta },
  ayudaTarjeta: { ...tipografia.detalle, color: colores.textoSuave, marginTop: 4, marginBottom: espaciado.xl },
  etiqueta: { ...tipografia.detalle, fontWeight: '700', color: colores.texto, marginBottom: 6 },
  campoIcono: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.sm,
    borderWidth: 1, borderColor: colores.bordeFuerte, borderRadius: radios.sm,
    paddingHorizontal: espaciado.md, marginBottom: espaciado.lg,
  },
  campo: { flex: 1, paddingVertical: 13, ...tipografia.cuerpo, color: colores.tinta },
  aviso: {
    flexDirection: 'row', alignItems: 'center', gap: espaciado.sm,
    backgroundColor: colores.errorClaro, borderRadius: radios.sm,
    padding: espaciado.md, marginBottom: espaciado.md,
  },
  avisoTexto: { flex: 1, color: colores.error, ...tipografia.detalle },
  boton: {
    backgroundColor: colores.marca, borderRadius: radios.sm,
    paddingVertical: 15, alignItems: 'center',
  },
  botonTexto: { color: colores.superficie, fontSize: 16, fontWeight: '700' },
});
