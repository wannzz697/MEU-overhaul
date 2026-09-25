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

export default function HomeScreen({ navigation, route }) {
  const user = route?.params?.user || { name: 'Motorista', role: 'ADMIN' };

  const [meta, setMeta] = useState(null);
  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    loadMeta();
  }, []);

  async function loadMeta() {
    setMetaLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/meta`);
      if (response.ok) {
        const data = await response.json();
        setMeta(data);
      }
    } catch (err) {
      // Falha silenciosa: a Meta é apenas informativa nesta tela.
    } finally {
      setMetaLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Alltak</Text>
      <Text style={styles.subtitle}>
        Conferência automática de insumos da linha de produção
      </Text>

      <View style={styles.badgeContainer}>
        <Text style={styles.welcomeText}>
          Bem-vindo, <Text style={styles.userName}>{user.name}</Text>{' '}
          <Text style={styles.userRole}>({user.role})</Text>
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Selecione o item, informe o código de conferência e confirme para validar o insumo antes de seguir com a produção.
        </Text>
      </View>

      <View style={styles.metaBox}>
        <Text style={styles.metaLabel}>🎯 Meta</Text>
        {metaLoading ? (
          <ActivityIndicator size="small" color="#0B5ED7" />
        ) : (
          <Text style={styles.metaValue}>
            {meta ? meta.value : '—'}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Conference')}
        >
          <Text style={styles.primaryButtonText}>Iniciar Conferência</Text>
        </TouchableOpacity>

        {user.role === 'ADMIN' && (
          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Admin')}
          >
            <Text style={styles.secondaryButtonText}>Painel do Administrador</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.footerText}>
        Protótipo acadêmico • Alltak Adesivos
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#5C7DB1',
    textAlign: 'center',
    marginBottom: 14,
  },
  badgeContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: '#0B5ED7',
  },
  userName: {
    fontWeight: 'bold',
  },
  userRole: {
    fontWeight: '600',
    fontSize: 12,
  },
  infoBox: {
    backgroundColor: '#EBF3FF',
    borderColor: '#B7D3FF',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 32,
    width: '100%',
    maxWidth: 600,
  },
  infoText: {
    color: '#0B3D91',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  metaBox: {
    backgroundColor: '#FFF8E6',
    borderColor: '#F5C453',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 32,
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#92710B',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B3D91',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 600,
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#0B3D91',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 'auto',
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
});