import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
    StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.13:8080';

// Componente para o formulário de Login
const LoginForm = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, senha });
            await AsyncStorage.setItem('userToken', response.data.token);
            onAuthSuccess();
        } catch (error) {
            Alert.alert('Erro', 'Email ou senha inválidos.');
        }
    };

    return (
        <>
            <Text style={styles.formTitle}>Acesse sua conta</Text>
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#aaa" secureTextEntry value={senha} onChangeText={setSenha} />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Acessar</Text>
            </TouchableOpacity>
        </>
    );
};

// Componente para o formulário de Cadastro
const RegisterForm = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        nome: '', cpf: '', curso: '', email: '', senha: '', confirmarSenha: ''
    });

    const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

    const handleRegister = async () => {
        if(formData.senha !== formData.confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }
        try {
            // O backend espera 'tipoUsuario', vamos definir um padrão
            const payload = { ...formData, tipoUsuario: 'comprador' };
            await axios.post(`${API_URL}/auth/register`, payload);
            Alert.alert('Sucesso', 'Conta criada! Faça o login para continuar.');
            onSwitchToLogin();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível criar a conta.');
        }
    };

    return (
        <ScrollView>
            <Text style={styles.formTitle}>Cadastre sua conta</Text>
            <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#aaa" value={formData.nome} onChangeText={v => handleChange('nome', v)} />
            <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#aaa" value={formData.cpf} onChangeText={v => handleChange('cpf', v)} />
            <TextInput style={styles.input} placeholder="Curso" placeholderTextColor="#aaa" value={formData.curso} onChangeText={v => handleChange('curso', v)} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" keyboardType="email-address" value={formData.email} onChangeText={v => handleChange('email', v)} />
            <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#aaa" secureTextEntry value={formData.senha} onChangeText={v => handleChange('senha', v)} />
            <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#aaa" secureTextEntry value={formData.confirmarSenha} onChangeText={v => handleChange('confirmarSenha', v)} />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};


// Tela Principal de Autenticação
export default function AuthScreen() {
    const [activeTab, setActiveTab] = useState('login'); // 'login' ou 'cadastro'
    const router = useRouter();

    const handleAuthSuccess = () => {
        // Navega para a tela principal do app após login/registro bem-sucedido
        router.replace('/usuario/profile');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.logoContainer}>
                    {/* Substitua por sua logo. Por enquanto, um texto. */}
                    <View style={styles.logoBackground}>
                        <Text style={styles.logoText}>SnackEach</Text>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity onPress={() => setActiveTab('login')}>
                            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
                            {activeTab === 'login' && <View style={styles.tabUnderline} />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('cadastro')}>
                            <Text style={[styles.tabText, activeTab === 'cadastro' && styles.activeTabText]}>Cadastro</Text>
                            {activeTab === 'cadastro' && <View style={styles.tabUnderline} />}
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'login' ? (
                        <LoginForm onAuthSuccess={handleAuthSuccess} />
                    ) : (
                        <RegisterForm onSwitchToLogin={() => setActiveTab('login')} />
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


// Folha de Estilos
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#DD6B20' }, // Laranja mais escuro para a área segura
    container: {
        flex: 1,
        backgroundColor: '#F57C00', // Laranja principal de fundo
        alignItems: 'center',
        paddingTop: 40,
    },
    logoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    logoBackground: {
        backgroundColor: 'white',
        borderRadius: 50,
        paddingVertical: 15,
        paddingHorizontal: 40,
    },
    logoText: {
        color: '#E65100',
        fontSize: 24,
        fontWeight: 'bold',
    },
    formContainer: {
        width: '90%',
        backgroundColor: '#E65100', // Laranja mais escuro para o formulário
        borderRadius: 20,
        padding: 20,
        flex: 1,
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    tabText: {
        color: '#FFCCBC', // Cor para aba inativa
        fontSize: 18,
        paddingBottom: 5,
    },
    activeTabText: {
        color: 'white', // Cor para aba ativa
        fontWeight: 'bold',
    },
    tabUnderline: {
        height: 3,
        backgroundColor: 'white',
        borderRadius: 2,
    },
    formTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    googleButton: {
        backgroundColor: 'white',
        borderRadius: 30,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    googleButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        marginBottom: 15,
        color: '#333',
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#E65100',
        fontSize: 18,
        fontWeight: 'bold',
    },
});