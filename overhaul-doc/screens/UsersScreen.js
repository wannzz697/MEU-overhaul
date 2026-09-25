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
  Alert,
  Platform,
} from 'react-native';
import { API_URL } from '../config/api';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      if (Platform.OS === 'web') {
        alert('Não foi possível carregar a lista de usuários.');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar a lista de usuários.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser() {
    if (!name || !email || !password) {
      const msg = 'Preencha todos os campos obrigatórios.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Atenção', msg);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        const msg = data.message || 'Falha ao criar usuário.';
        if (Platform.OS === 'web') alert(msg);
        else Alert.alert('Erro', msg);
        return;
      }

      setModalVisible(false);
      setName('');
      setEmail('');
      setPassword('');
      setRole('USER');
      loadUsers();
    } catch (err) {
      if (Platform.OS === 'web') alert('Não foi possível conectar ao servidor.');
      else Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleRole(user) {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';

    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        loadUsers();
      }
    } catch (err) {
      if (Platform.OS === 'web') alert('Falha ao alterar a permissão do usuário.');
      else Alert.alert('Erro', 'Falha ao alterar a permissão do usuário.');
    }
  }

  async function handleDeleteUser(id) {
    const executeDelete = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          loadUsers();
        } else {
          const data = await response.json();
          const msg = data.message || 'Falha ao remover usuário.';
          if (Platform.OS === 'web') alert(msg);
          else Alert.alert('Erro', msg);
        }
      } catch (err) {
        if (Platform.OS === 'web') alert('Erro ao conectar ao servidor para remover.');
        else Alert.alert('Erro', 'Erro ao conectar ao servidor para remover.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Deseja realmente remover este usuário?')) {
        executeDelete();
      }
    } else {
      Alert.alert('Confirmar Exclusão', 'Deseja realmente remover este usuário?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: executeDelete,
        },
      ]);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Criar Novo Usuário</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#0B5ED7" style={{ marginTop: 20 }} />
        ) : (
          users.map((item) => (
            <View key={item.id} style={styles.userCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text
                  style={[
                    styles.roleBadge,
                    item.role === 'ADMIN' ? styles.adminBadge : styles.userBadge,
                  ]}
                >
                  {item.role}
                </Text>
              </View>

              <View style={styles.actionColumn}>
                <TouchableOpacity
                  style={styles.roleButton}
                  onPress={() => handleToggleRole(item)}
                >
                  <Text style={styles.roleButtonText}>
                    Mudar para {item.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Usuário</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleOption, role === 'USER' && styles.roleActive]}
                onPress={() => setRole('USER')}
              >
                <Text style={role === 'USER' ? styles.roleActiveText : styles.roleOptionText}>
                  Usuário
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleOption, role === 'ADMIN' && styles.roleActive]}
                onPress={() => setRole('ADMIN')}
              >
                <Text style={role === 'ADMIN' ? styles.roleActiveText : styles.roleOptionText}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleCreateUser}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Salvar no Banco</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  addButton: {
    backgroundColor: '#1E9E52',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  userCard: {
    borderWidth: 1,
    borderColor: '#B7D3FF',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F5F9FF',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#0B3D91' },
  userEmail: { fontSize: 13, color: '#5C7DB1', marginTop: 2 },
  roleBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  userBadge: { backgroundColor: '#E2E8F0', color: '#475569' },
  adminBadge: { backgroundColor: '#FEF3C7', color: '#92400E' },
  actionColumn: { gap: 6 },
  roleButton: { backgroundColor: '#0B5ED7', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  roleButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  deleteButton: { backgroundColor: '#D92D20', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, alignItems: 'center' },
  deleteButtonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0B3D91', marginBottom: 14, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#B7D3FF', borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor: '#F5F9FF' },
  roleSelector: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  roleOption: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#B7D3FF', alignItems: 'center' },
  roleActive: { backgroundColor: '#0B5ED7', borderColor: '#0B5ED7' },
  roleOptionText: { color: '#0B3D91', fontWeight: 'bold' },
  roleActiveText: { color: '#FFFFFF', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#1E9E52', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  cancelButton: { padding: 10, alignItems: 'center', marginTop: 4 },
  cancelButtonText: { color: '#D92D20', fontWeight: 'bold' },
});