import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const API_URL = 'http://192.168.0.13:8080';

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        cpf: '',
        nome: '',
        email: '',
        senha: '',
        curso: '',
        tipoUsuario: 'comprador'
    });
    const router = useRouter();

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async () => {
        try {
            await axios.post(`${API_URL}/register`, formData);
            Alert.alert('Sucesso', 'Usuário registrado com sucesso! Faça o login para continuar.');
            router.push('/login'); // Leva o usuário para a tela de login
        } catch (error) {
            console.error(error);
            Alert.alert('Erro no Registro', 'Não foi possível completar o registro.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Crie sua Conta</Text>
            <TextInput style={styles.input} placeholder="CPF" value={formData.cpf} onChangeText={(val) => handleChange('cpf', val)} />
            <TextInput style={styles.input} placeholder="Nome Completo" value={formData.nome} onChangeText={(val) => handleChange('nome', val)} />
            <TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={(val) => handleChange('email', val)} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Senha" value={formData.senha} onChangeText={(val) => handleChange('senha', val)} secureTextEntry />
            <TextInput style={styles.input} placeholder="Curso" value={formData.curso} onChangeText={(val) => handleChange('curso', val)} />
            {/* Poderia ser um Picker/Select aqui, mas vamos simplificar com TextInput por enquanto */}
            <TextInput style={styles.input} placeholder="Tipo (aluno/professor)" value={formData.tipoUsuario} onChangeText={(val) => handleChange('tipoUsuario', val)} />
            <Button title="Registrar" onPress={handleRegister} />
            <Text style={styles.linkText} onPress={() => router.push('/login')}>
                Já tem uma conta? Faça Login
            </Text>
        </ScrollView>
    );
}

// Estilos similares ao do login.js...
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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