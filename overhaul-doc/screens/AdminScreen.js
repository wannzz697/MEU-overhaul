import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function AdminScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel Administrativo</Text>
      <Text style={styles.subtitle}>
        Gerencie usuários, estoque e acompanhe os relatórios do sistema.
      </Text>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Users')}
      >
        <Text style={styles.cardTitle}>👤 Gestão de Usuários</Text>
        <Text style={styles.cardDescription}>
          Cadastre novos usuários, altere permissões (USER/ADMIN) e remova contas.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.cardTitle}>📋 Histórico de Conferências</Text>
        <Text style={styles.cardDescription}>
          Consulte os registros das conferências por operador e data.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Items')}
      >
        <Text style={styles.cardTitle}>📦 Estoque</Text>
        <Text style={styles.cardDescription}>
          Visualize os insumos cadastrados e as quantidades em estoque (somente leitura).
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Meta')}
      >
        <Text style={styles.cardTitle}>🎯 Meta</Text>
        <Text style={styles.cardDescription}>
          Visualize e defina o valor atual da Meta exibida para os usuários.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#5C7DB1',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#F5F9FF',
    borderWidth: 1,
    borderColor: '#B7D3FF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
});