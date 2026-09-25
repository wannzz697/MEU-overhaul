import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { API_URL } from '../config/api';

// O ADMIN passou a ter apenas permissão de VISUALIZAÇÃO do Estoque.
// Cadastro, edição e remoção de insumos foram desativados nesta tela.
export default function ItemsScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/items`);
      if (!response.ok) {
        setError('Não foi possível carregar os insumos.');
        return;
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError('Erro de conexão ao carregar lista de insumos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.readOnlyBanner}>
          <Text style={styles.readOnlyBannerText}>
            👁️ Modo somente leitura — o Estoque não pode ser alterado por aqui.
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#0B5ED7" />
          </View>
        ) : error ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadItems}>
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.itemList}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCode}>Código: {item.code}</Text>
                  <Text style={styles.itemQuantity}>
                    Estoque: <Text style={{ fontWeight: 'bold' }}>{item.quantity}</Text> un.
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  readOnlyBanner: {
    backgroundColor: '#EBF3FF',
    borderColor: '#B7D3FF',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  readOnlyBannerText: {
    color: '#0B3D91',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  centerBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    color: '#D92D20',
    fontSize: 15,
    marginBottom: 12,
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
  itemList: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F9FF',
    borderWidth: 1,
    borderColor: '#B7D3FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 4,
  },
  itemCode: {
    fontSize: 13,
    color: '#5C7DB1',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 13,
    color: '#333333',
  },
});