import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { API_URL } from '../config/api';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const validarEmail = (emailTexto) => {
    const emailLimpo = emailTexto.trim().toLowerCase();
    return emailLimpo.includes('@') && emailLimpo.includes('.com');
  };

  async function handleCadastrar() {
    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      setSucesso(false);
      setError('Preencha todos os campos para continuar.');
      return;
    }

    if (!validarEmail(email)) {
      setSucesso(false);
      setError('Por favor, informe um e-mail válido contendo "@" e ".com".');
      return;
    }

    if (senha !== confirmarSenha) {
      setSucesso(false);
      setError('As senhas informadas não coincidem.');
      return;
    }

    setError('');
    setCarregando(true);

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nome.trim(),
          email: email.trim(),
          password: senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSucesso(false);
        setError(data.message || 'Não foi possível concluir o cadastro.');
        return;
      }

      setSucesso(true);
    } catch (err) {
      setSucesso(false);
      setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>
          Preencha os dados abaixo para se cadastrar
        </Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          placeholderTextColor="#9AAFD6"
          value={nome}
          onChangeText={(text) => {
            setNome(text);
            setSucesso(false);
          }}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="seuemail@empresa.com"
          placeholderTextColor="#9AAFD6"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setSucesso(false);
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite uma senha"
          placeholderTextColor="#9AAFD6"
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            setSucesso(false);
          }}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite a senha novamente"
          placeholderTextColor="#9AAFD6"
          value={confirmarSenha}
          onChangeText={(text) => {
            setConfirmarSenha(text);
            setSucesso(false);
          }}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {sucesso ? (
          <Text style={styles.successText}>
            Cadastro realizado com sucesso! Você já pode entrar com sua conta.
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleCadastrar}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Login')}
          style={styles.linkWrapper}
        >
          <Text style={styles.linkText}>
            Já possui uma conta? <Text style={styles.linkTextBold}>Entrar</Text>
          </Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0B3D91',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0B3D91',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#B7D3FF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0B3D91',
    backgroundColor: '#F5F9FF',
    width: '100%',
    marginBottom: 18,
  },
  errorText: {
    color: '#D92D20',
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  successText: {
    color: '#1E9E52',
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 18,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkWrapper: {
    marginTop: 24,
  },
  linkText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
  },
  linkTextBold: {
    color: '#0B5ED7',
    fontWeight: 'bold',
  },
});