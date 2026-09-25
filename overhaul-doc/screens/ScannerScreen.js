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
  Button,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { API_URL } from '../config/api';

export default function ScannerScreen({ navigation, route }) {
  const { item } = route.params;
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  async function processCodeValidation(codeToVerify) {
    if (!codeToVerify.trim()) {
      setError('Digite ou escaneie o código antes de continuar.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/items/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, codeInput: codeToVerify }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Código incorreto. Verifique e tente novamente.');
        setScanned(false); 
        return;
      }

      navigation.navigate('Quantity', { item: data.item });
    } catch (err) {
      setError('Não foi possível conectar ao servidor backend.');
      setScanned(false);
    } finally {
      setLoading(false);
    }
  }

  function handleBarcodeScanned({ data }) {
    if (scanned || loading) return;

    setScanned(true);
    setCodeInput(data);
    processCodeValidation(data);
  }

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0B5ED7" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.permissionText}>
          Precisamos de permissão para acessar a câmera do dispositivo.
        </Text>
        <TouchableOpacity style={styles.confirmButton} onPress={requestPermission}>
          <Text style={styles.confirmButtonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Produto selecionado</Text>
          <Text style={styles.infoValue}>{item.name}</Text>

          <Text style={styles.infoLabel}>Código esperado</Text>
          <Text style={styles.infoValue}>{item.code}</Text>
        </View>

        {}
        <View style={styles.scannerArea}>
          <View style={styles.scannerFrame}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr', 'code128', 'code39', 'ean13', 'ean8'],
              }}
            />
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          {scanned && (
            <TouchableOpacity
              style={styles.rescanButton}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.rescanButtonText}>Escanear Novamente</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.label}>Ou digite o código manualmente</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: COL-500"
          placeholderTextColor="#9AAFD6"
          value={codeInput}
          onChangeText={setCodeInput}
          autoCapitalize="characters"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.8}
          onPress={() => processCodeValidation(codeInput)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar Código</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  permissionText: {
    fontSize: 16,
    color: '#0B3D91',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#B7D3FF',
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 13,
    color: '#5C7DB1',
    marginTop: 6,
  },
  infoValue: {
    fontSize: 18,
    color: '#0B3D91',
    fontWeight: 'bold',
  },
  scannerArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scannerFrame: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000000',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#4FA3FF',
    zIndex: 10,
  },
  cornerTopLeft: {
    top: 12,
    left: 12,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 12,
    right: 12,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  rescanButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#EAF2FF',
    borderRadius: 8,
  },
  rescanButtonText: {
    color: '#0B5ED7',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderColor: '#B7D3FF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#0B3D91',
    backgroundColor: '#F5F9FF',
    letterSpacing: 1,
  },
  errorText: {
    color: '#D92D20',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    elevation: 3,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});