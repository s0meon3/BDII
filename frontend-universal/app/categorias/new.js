import React, {useEffect, useState} from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
    StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useAuth } from '@/context/authContext';

const API_URL = 'http://192.168.0.13:8080';

const FormularioCategoria = ({ router }) => {
    const { user } = useAuth();
    const [nomeCategoria, setNomeCategoria] = useState('');

    const handleCadastroCategoria = async () => {
        if (!nomeCategoria.trim()) {
            Alert.alert('Erro', 'O nome da categoria é obrigatório.');
            return;
        }

        if (!user?.token) {
            Alert.alert("Erro", "Você precisa estar logado para cadastrar uma categoria.");
            return;
        }

        try {
            const payload = { nome: nomeCategoria };
            await axios.post(`${API_URL}/categorias`, payload, {
                headers: { 'Authorization': `Bearer ${user.token}` } // USA O TOKEN DO CONTEXTO
            });
            Alert.alert('Sucesso', 'Categoria cadastrada com sucesso!');
            router.back();
        } catch (error) {
            console.error('Detalhes do erro:', error.response?.data || error.message);
            Alert.alert('Erro', 'Não foi possível cadastrar a categoria. Tente novamente.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.formTitle}>Cadastrar Nova Categoria</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome da Categoria"
                placeholderTextColor="#aaa"
                value={nomeCategoria}
                onChangeText={setNomeCategoria}
            />

            <TouchableOpacity style={styles.button} onPress={handleCadastroCategoria}>
                <Text style={styles.buttonText}>Cadastrar Categoria</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default function CadastroCategoriaScreen() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && (user?.role !== 'ADMIN' && user?.role !== 'VENDEDOR')) {
            Alert.alert("Acesso Negado", "Você não tem permissão para acessar esta página.");
            router.replace('/(tabs)/home');
        }
    }, [user, isLoading, router]);

    if (isLoading || (user?.role !== 'ADMIN' && user?.role !== 'VENDEDOR')) {
        return <SafeAreaView style={styles.safeArea}></SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.logoContainer}>
                    <View style={styles.logoBackground}>
                        <Text style={styles.logoText}>SnackEach</Text>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <FormularioCategoria router={router} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#DD6B20' },
    container: {
        flex: 1,
        backgroundColor: '#F57C00',
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
        backgroundColor: '#E65100',
        borderRadius: 20,
        padding: 20,
        flex: 1,
        marginBottom: 20,
    },
    formTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
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
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20,
    }
});