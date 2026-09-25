import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { API_URL } from '../config/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'E-mail ou senha inválidos.');
        return;
      }

      navigation.replace('Home', { user: data });
    } catch (err) {
      setError('Erro de conexão ao tentar fazer login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo Alltak — exibida somente na tela de Login */}
        <View style={styles.logoBadge}>
          <Image
            source={require('../assets/logo-alltak.webp')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Alltak</Text>

        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>E-mail:</Text>
          <TextInput
            style={styles.input}
            placeholder="seu.email@alltak.com.br"
            placeholderTextColor="#9AAFD6"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.inputLabel}>Senha:</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9AAFD6"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.signupText}>
              Não tem uma conta? <Text style={styles.signupBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          Alltak Adesivos
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoBadge: {
    width: '100%',
    maxWidth: 260,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logoImage: {
    width: '100%',
    height: 130,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 28,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#B7D3FF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0B3D91',
    backgroundColor: '#F5F9FF',
  },
  errorText: {
    color: '#D92D20',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    elevation: 2,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
  },
  signupText: {
    fontSize: 14,
    color: '#5C7DB1',
  },
  signupBold: {
    color: '#0B5ED7',
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 36,
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
});