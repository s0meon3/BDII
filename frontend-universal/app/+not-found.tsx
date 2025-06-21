import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
      <SafeAreaView style={styles.safeArea}>
        {/* Configura o título no topo da tela */}
        <Stack.Screen options={{ title: 'Oops!', headerBackTitle: 'Voltar' }} />

        <View style={styles.container}>
          <FontAwesome name="frown-o" size={80} color="white" />
          <Text style={styles.title}>Página Não Encontrada</Text>
          <Text style={styles.message}>
            A tela que você está tentando acessar não existe ou foi movida.
          </Text>

          {/* O componente Link do Expo Router lida com a navegação */}
          <Link href="/(tabs)/produtos/home" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Voltar para a tela inicial</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F57C00',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#FFCCBC',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#E65100',
    fontSize: 18,
    fontWeight: 'bold',
  },
});