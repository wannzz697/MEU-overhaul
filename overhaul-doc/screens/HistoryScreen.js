import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { API_URL } from '../config/api';

export default function HistoryScreen() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function loadLogs() {
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/items/logs`);
      if (!response.ok) {
        setError('Não foi possível carregar o histórico de conferências.');
        return;
      }
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError('Erro de conexão ao buscar o histórico.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  function onRefresh() {
    setRefreshing(true);
    loadLogs();
  }

  function formatData(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function renderLogItem({ item }) {
    return (
      <View style={styles.logCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.operatorText}>
            👤 {item.user?.name || 'Operador desconhecido'}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.status ? '#EAF7EE' : '#FDEDEC' },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: item.status ? '#1E9E52' : '#D92D20' },
              ]}
            >
              {item.status ? '✓ Sucesso' : '✕ Erro'}
            </Text>
          </View>
        </View>

        <Text style={styles.itemTitle}>
          📦 {item.item?.name || 'Item não especificado'}
        </Text>
        <Text style={styles.itemCode}>
          Código: {item.item?.code || 'N/A'}
        </Text>

        <Text style={styles.dateText}>📅 {formatData(item.createdAt)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#0B5ED7" />
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadLogs}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={renderLogItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma conferência registrada no histórico.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logCard: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B7D3FF',
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  operatorText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0B3D91',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 2,
  },
  itemCode: {
    fontSize: 13,
    color: '#5C7DB1',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  errorText: {
    color: '#D92D20',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#8A8A8A',
    fontSize: 15,
    marginTop: 40,
  },
});