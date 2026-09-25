import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { API_URL } from '../config/api';

export default function QuantityScreen({ navigation, route }) {
  const { item: itemInicial } = route.params;

  const [item, setItem] = useState(itemInicial);
  const [logStatus, setLogStatus] = useState('saving'); 

  const [amountInput, setAmountInput] = useState('');
  const [addingStatus, setAddingStatus] = useState('idle'); 
  const [addError, setAddError] = useState('');

  useEffect(() => {
    registerConference();
  }, []);

  async function registerConference() {
    setLogStatus('saving');

    try {
      const userResponse = await fetch(`${API_URL}/api/users/first`);
      if (!userResponse.ok) throw new Error('Não foi possível obter o usuário.');
      const user = await userResponse.json();

      const logResponse = await fetch(`${API_URL}/api/items/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, itemId: item.id, status: true }),
      });

      setLogStatus(logResponse.ok ? 'saved' : 'error');
    } catch (err) {
      setLogStatus('error');
    }
  }

  async function handleAddQuantity() {
    const amount = Number(amountInput);

    if (!amountInput.trim() || isNaN(amount) || amount <= 0) {
      setAddError('Digite uma quantidade válida (maior que zero).');
      return;
    }

    setAddError('');
    setAddingStatus('saving');

    try {
      const response = await fetch(`${API_URL}/api/items/add-quantity`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAddError(data.message || 'Não foi possível atualizar o estoque.');
        setAddingStatus('error');
        return;
      }

      setItem(data);
      setAmountInput('');
      setAddingStatus('idle');
    } catch (err) {
      setAddError('Não foi possível conectar ao servidor.');
      setAddingStatus('error');
    }
  }

  function handleNewConference() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Conference' }],
      })
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusBadge}>
        <Text style={styles.statusBadgeText}>✓ Produto identificado</Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.detailLabel}>Produto</Text>
        <Text style={styles.detailValue}>{item.name}</Text>

        <Text style={styles.detailLabel}>Código</Text>
        <Text style={styles.detailValue}>{item.code}</Text>

        <Text style={styles.detailLabel}>Quantidade disponível</Text>
        <Text style={styles.quantityValue}>{item.quantity} unidades</Text>
      </View>

      {logStatus === 'error' && (
        <Text style={styles.logErrorText}>
          Não foi possível registrar esta conferência no servidor.
        </Text>
      )}

      <View style={styles.addBox}>
        <Text style={styles.addLabel}>Adicionar unidades ao estoque</Text>
        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            placeholder="Ex: 10"
            placeholderTextColor="#9AAFD6"
            keyboardType="numeric"
            value={amountInput}
            onChangeText={(text) => {
              setAmountInput(text);
              setAddError('');
            }}
          />
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={handleAddQuantity}
            disabled={addingStatus === 'saving'}
          >
            {addingStatus === 'saving' ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.addButtonText}>Adicionar</Text>
            )}
          </TouchableOpacity>
        </View>
        {addError ? <Text style={styles.addErrorText}>{addError}</Text> : null}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.8}
        onPress={handleNewConference}
      >
        <Text style={styles.primaryButtonText}>Nova Conferência</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  statusBadge: {
    backgroundColor: '#EAF7EE',
    borderWidth: 1,
    borderColor: '#1E9E52',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  statusBadgeText: {
    color: '#1E9E52',
    fontSize: 15,
    fontWeight: 'bold',
  },
  detailsBox: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#B7D3FF',
  },
  detailLabel: {
    fontSize: 13,
    color: '#5C7DB1',
    marginTop: 10,
  },
  detailValue: {
    fontSize: 18,
    color: '#0B3D91',
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 28,
    color: '#0B5ED7',
    fontWeight: 'bold',
    marginTop: 4,
  },
  logErrorText: {
    color: '#D92D20',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  addBox: {
    width: '100%',
    marginBottom: 24,
  },
  addLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 8,
  },
  addRow: {
    flexDirection: 'row',
    gap: 10,
  },
  addInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#B7D3FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#0B3D91',
    backgroundColor: '#F5F9FF',
  },
  addButton: {
    backgroundColor: '#0B5ED7',
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  addErrorText: {
    color: '#D92D20',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 18,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
