import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';

export default function ResultScreen({ navigation, route }) {
  const { success, itemName, expectedCode, enteredCode } = route.params;

  function handleNewConference() {
    navigation.navigate('Conference');
  }

  function handleGoHome() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: success ? '#EAF7EE' : '#FDEDEC' },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: success ? '#1E9E52' : '#D92D20' },
        ]}
      >
        <Text style={styles.iconText}>{success ? '✓' : '✕'}</Text>
      </View>

      <Text
        style={[
          styles.statusTitle,
          { color: success ? '#1E9E52' : '#D92D20' },
        ]}
      >
        {success ? 'Conferência Correta' : 'Conferência Incorreta'}
      </Text>

      <Text style={styles.statusMessage}>
        {success
          ? 'O item foi validado com sucesso e está liberado para produção.'
          : 'O código informado não corresponde ao item selecionado. Verifique e tente novamente.'}
      </Text>

      <View style={styles.detailsBox}>
        <Text style={styles.detailLabel}>Item</Text>
        <Text style={styles.detailValue}>{itemName}</Text>

        <Text style={styles.detailLabel}>Código informado</Text>
        <Text style={styles.detailValue}>{enteredCode}</Text>

        {!success && (
          <>
            <Text style={styles.detailLabel}>Código esperado</Text>
            <Text style={styles.detailValue}>{expectedCode}</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.8}
        onPress={handleNewConference}
      >
        <Text style={styles.primaryButtonText}>Nova Conferência</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        activeOpacity={0.8}
        onPress={handleGoHome}
      >
        <Text style={styles.secondaryButtonText}>Voltar ao Início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusMessage: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
    lineHeight: 22,
  },
  detailsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  detailLabel: {
    fontSize: 13,
    color: '#888888',
    marginTop: 8,
  },
  detailValue: {
    fontSize: 17,
    color: '#0B3D91',
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 18,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0B5ED7',
    fontSize: 16,
    fontWeight: '600',
  },
});
