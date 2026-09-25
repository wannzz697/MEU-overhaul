import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { API_URL } from '../config/api';

export default function MetaScreen({ route }) {
  const role = route?.params?.user?.role || 'ADMIN';

  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [valueInput, setValueInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadMeta();
  }, []);

  async function loadMeta() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/meta`);
      if (!response.ok) {
        setError('Não foi possível carregar a Meta.');
        return;
      }
      const data = await response.json();
      setMeta(data);
      setValueInput(String(data.value));
    } catch (err) {
      setError('Erro de conexão ao carregar a Meta.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    const value = Number(valueInput);

    if (valueInput.trim() === '' || Number.isNaN(value)) {
      setSaveError('Digite um valor numérico válido para a Meta.');
      return;
    }

    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const response = await fetch(`${API_URL}/api/meta`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, role: 'ADMIN' }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSaveError(data.message || 'Não foi possível atualizar a Meta.');
        return;
      }

      setMeta(data);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError('Não foi possível conectar ao servidor.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0B5ED7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMeta}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Meta</Text>
      <Text style={styles.subtitle}>
        Defina o valor da meta atual. Esse valor fica visível para todos os
        usuários na tela inicial.
      </Text>

      <View style={styles.currentBox}>
        <Text style={styles.currentLabel}>Meta atual</Text>
        <Text style={styles.currentValue}>{meta?.value ?? '—'}</Text>
      </View>

      <Text style={styles.inputLabel}>Novo valor da Meta:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 1000"
        placeholderTextColor="#9AAFD6"
        keyboardType="numeric"
        value={valueInput}
        onChangeText={(text) => {
          setValueInput(text);
          setSaveError('');
          setSaveSuccess(false);
        }}
      />

      {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}
      {saveSuccess ? (
        <Text style={styles.successText}>Meta atualizada com sucesso!</Text>
      ) : null}

      <TouchableOpacity
        style={styles.saveButton}
        activeOpacity={0.8}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Meta</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#5C7DB1',
    marginBottom: 20,
    lineHeight: 20,
  },
  currentBox: {
    backgroundColor: '#FFF8E6',
    borderColor: '#F5C453',
    borderWidth: 1,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  currentLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#92710B',
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0B3D91',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 6,
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
    marginBottom: 12,
  },
  errorText: {
    color: '#D92D20',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    color: '#1E9E52',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#1E9E52',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
