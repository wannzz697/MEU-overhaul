import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';
import ConferenceScreen from './screens/ConferenceScreen';
import ScannerScreen from './screens/ScannerScreen';
import QuantityScreen from './screens/QuantityScreen';
import ResultScreen from './screens/ResultScreen';
import AdminScreen from './screens/AdminScreen';
import UsersScreen from './screens/UsersScreen';
import HistoryScreen from './screens/HistoryScreen';
import ItemsScreen from './screens/ItemsScreen';
import MetaScreen from './screens/MetaScreen';

const Stack = createNativeStackNavigator();

// Botão de "Voltar" customizado usado na tela Home, já que ela é a raiz
// da navegação após o login (não existe uma tela anterior no histórico
// para a qual voltar nativamente). Ele retorna o usuário para o Login.
function HomeBackButton({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        )
      }
      style={backStyles.button}
      activeOpacity={0.7}
    >
      <Text style={backStyles.text}>‹ Voltar</Text>
    </TouchableOpacity>
  );
}

const backStyles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: '#0B5ED7' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          headerBackTitleVisible: false,
          // Botão de voltar visível e funcional em todas as telas,
          // exceto no Login (que tem headerShown: false).
          headerBackVisible: true,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Entrar', headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={CadastroScreen}
          options={{ title: 'Criar Conta' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Alltak',
            headerLeft: () => <HomeBackButton navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="Conference"
          component={ConferenceScreen}
          options={{ title: 'Conferência de Itens' }}
        />
        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{ title: 'Leitor de Código' }}
        />
        <Stack.Screen
          name="Quantity"
          component={QuantityScreen}
          options={{ title: 'Quantidade Disponível' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ title: 'Resultado' }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: 'Painel do Administrador' }}
        />
        <Stack.Screen
          name="Users"
          component={UsersScreen}
          options={{ title: 'Gestão de Usuários' }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{ title: 'Histórico de Conferências' }}
        />
        <Stack.Screen
          name="Items"
          component={ItemsScreen}
          options={{ title: 'Estoque' }}
        />
        <Stack.Screen
          name="Meta"
          component={MetaScreen}
          options={{ title: 'Meta' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
