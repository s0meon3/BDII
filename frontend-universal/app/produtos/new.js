import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
    StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// URL da sua API. Ajuste se necessário.
const API_URL = 'http://127.0.0.1:8080';


const FormularioProduto = ({ router }) => {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        imageUrl: '',
    });

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCadastroProduto = async () => {
        if (!formData.nome || !formData.preco) {
            Alert.alert('Erro', 'Os campos "Nome" e "Preço" são obrigatórios.');
            return;
        }

        try {
            const vendedorId = await AsyncStorage.getItem('userId');
            const token = await AsyncStorage.getItem('userToken');

            if (!vendedorId) {
                Alert.alert('Erro de Autenticação', 'Não foi possível identificar o vendedor. Por favor, faça login novamente.');
                return;
            }

            // Payload ajustado para corresponder exatamente ao ProdutoCreateUpdateDTO
            const payload = {
                nome: formData.nome,
                descricao: formData.descricao,
                imageUrl: formData.imageUrl,
                preco: parseFloat(formData.preco.replace(',', '.')), // Garante que o preço seja um número
                vendedorUsuarioId: parseInt(vendedorId, 10), // Ajustado para enviar apenas o ID
                categoriaIds: [1], // Adicionado conforme solicitado, com valor fixo
            };

            // Enviando a requisição para o endpoint de produtos
            // A URL `/produtos` geralmente corresponde ao método do Controller que recebe o DTO
            await axios.post(`${API_URL}/produtos`, payload, {
                                                              headers: { 'Authorization': `Bearer ${token}` }
                                                              });

            Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
            router.back();

        } catch (error) {
            console.error('Detalhes do erro:', error.response?.data || error.message);
            Alert.alert('Erro', 'Não foi possível cadastrar o produto. Verifique os dados e tente novamente.');
        }
    };

    return (
        <ScrollView>
            <Text style={styles.formTitle}>Cadastrar Novo Produto</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome do Produto"
                placeholderTextColor="#aaa"
                value={formData.nome}
                onChangeText={v => handleChange('nome', v)}
            />
            <TextInput
                style={styles.input}
                placeholder="Descrição do Produto"
                placeholderTextColor="#aaa"
                value={formData.descricao}
                onChangeText={v => handleChange('descricao', v)}
                multiline
            />
            <TextInput
                style={styles.input}
                placeholder="Preço (ex: 15,50)"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={formData.preco}
                onChangeText={v => handleChange('preco', v)}
            />
            <TextInput
                style={styles.input}
                placeholder="URL da Imagem do Produto"
                placeholderTextColor="#aaa"
                value={formData.imageUrl}
                onChangeText={v => handleChange('imageUrl', v)}
            />

            <TouchableOpacity style={styles.button} onPress={handleCadastroProduto}>
                <Text style={styles.buttonText}>Cadastrar Produto</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// --- Tela Principal de Cadastro de Produto ---
export default function CadastroProdutoScreen() {
    const router = useRouter();

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
                    <FormularioProduto router={router} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// --- Folha de Estilos (sem alterações) ---
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
});