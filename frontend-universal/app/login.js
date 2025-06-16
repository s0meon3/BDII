import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://192.168.0.13:8080';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const router = useRouter(); // Hook para navegação

    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/login`, { email, senha });
            const { token } = response.data;

            // Salva o token no armazenamento local do dispositivo
            await AsyncStorage.setItem('userToken', token);

            Alert.alert('Sucesso', 'Login realizado com sucesso!');

            // Redireciona para a tela principal do app (home dentro das tabs)
            router.replace('/(tabs)/home');

        } catch (error) {
            console.error(error);
            Alert.alert('Erro no Login', 'Email ou senha inválidos.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo de Volta!</Text>
            <TextInput
                style={styles.input}
                placeholder="Seu e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Sua senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry // Esconde a senha
            />
            <Button title="Entrar" onPress={handleLogin} />
            <Text style={styles.linkText} onPress={() => router.push('/register')}>
                Não tem uma conta? Registre-se
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    linkText: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 20,
    },
});