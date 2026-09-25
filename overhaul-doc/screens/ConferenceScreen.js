import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { API_URL } from '../config/api';

export default function ConferenceScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newQuantity, setNewQuantity] = useState('0');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');

  const [isScanningCode, setIsScanningCode] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/items`);

      if (!response.ok) {
        setError('Não foi possível carregar os itens.');
        return;
      }

      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  }

  function handleSelectItem(item) {
    navigation.navigate('Scanner', { item });
  }

  async function handleOpenScanner() {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        setModalError('Permissão para acessar a câmera é necessária.');
        return;
      }
    }
    setIsScanningCode(true);
  }

  function handleBarcodeScanned({ data }) {
    setNewCode(data);
    setIsScanningCode(false);
  }

  async function handleCreateItem() {
    if (!newName.trim() || !newCode.trim()) {
      setModalError('Preencha o nome e o código do QR Code.');
      return;
    }

    setSaving(true);
    setModalError('');

    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          code: newCode.trim().toUpperCase(),
          quantity: parseInt(newQuantity, 10) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setModalError(data.message || 'Erro ao cadastrar novo produto.');
        return;
      }

      setModalVisible(false);
      setNewName('');
      setNewCode('');
      setNewQuantity('0');

      await loadItems();

      navigation.navigate('Scanner', { item: data });
    } catch (err) {
      setModalError('Não foi possível conectar ao servidor para cadastrar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Selecione o item para conferência</Text>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => {
            setModalError('');
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Adicionar Novo Produto</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#0B5ED7" />
          </View>
        )}

        {!loading && error ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              activeOpacity={0.8}
              onPress={loadItems}
            >
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!loading && !error && (
          <View style={styles.itemList}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                activeOpacity={0.8}
                onPress={() => handleSelectItem(item)}
              >
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemCode}>Código: {item.code}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cadastrar Novo Produto</Text>

            <Text style={styles.inputLabel}>Nome do Produto:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Cola Branca 500ml"
              placeholderTextColor="#9AAFD6"
              value={newName}
              onChangeText={setNewName}
            />

            <Text style={styles.inputLabel}>Código / QR Code Esperado:</Text>
            <View style={styles.codeRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Ex: COL-500"
                placeholderTextColor="#9AAFD6"
                value={newCode}
                onChangeText={setNewCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.scanButton}
                activeOpacity={0.8}
                onPress={handleOpenScanner}
              >
                <Text style={styles.scanButtonText}>📷 Ler QR</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Quantidade Inicial:</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#9AAFD6"
              keyboardType="numeric"
              value={newQuantity}
              onChangeText={setNewQuantity}
            />

            {modalError ? <Text style={styles.errorText}>{modalError}</Text> : null}

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              onPress={handleCreateItem}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Salvar no Banco e Ir para Leitura</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setIsScanningCode(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {}
        {isScanningCode && (
          <View style={StyleSheet.absoluteFillObject}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              onBarcodeScanned={handleBarcodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr', 'code128', 'code39', 'ean13', 'ean8'],
              }}
            >
              <View style={styles.cameraOverlay}>
                <Text style={styles.cameraTitle}>Aponte para o QR Code do produto</Text>
                <TouchableOpacity
                  style={styles.closeCameraButton}
                  onPress={() => setIsScanningCode(false)}
                >
                  <Text style={styles.closeCameraButtonText}>Cancelar Câmera</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#1E9E52',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerBox: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  errorText: {
    color: '#D92D20',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  retryButton: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  itemList: {
    gap: 10,
  },
  itemCard: {
    borderWidth: 2,
    borderColor: '#B7D3FF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F5F9FF',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#0B3D91',
    fontWeight: '600',
  },
  itemCode: {
    fontSize: 13,
    color: '#5C7DB1',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B3D91',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: '#B7D3FF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#0B3D91',
    backgroundColor: '#F5F9FF',
    marginBottom: 10,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: '#0B5ED7',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#1E9E52',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 14,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  cancelButtonText: {
    color: '#D92D20',
    fontSize: 15,
    fontWeight: '600',
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'space-between',
    padding: 40,
    alignItems: 'center',
  },
  cameraTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeCameraButton: {
    backgroundColor: '#D92D20',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  closeCameraButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
