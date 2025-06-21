import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
    StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/context/authContext';

const API_URL = 'http://192.168.0.13:8080';

const FormularioProduto = ({ router }) => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: '',
        imageUrl: '',
    });
    const [categorias, setCategorias] = useState([]);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && (user?.role !== 'ADMIN' && user?.role !== 'VENDEDOR')) {
            Alert.alert("Acesso Negado", "Você não tem permissão para cadastrar produtos.");
            router.replace('/(tabs)/home');
            return;
        }

        const fetchCategorias = async () => {
            if (user?.token) {
                try {
                    // 3. Usa o token do contexto para buscar as categorias
                    const response = await axios.get(`${API_URL}/categorias`, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    setCategorias(response.data);
                    if (response.data.length > 0) {
                        setCategoriaSelecionada(response.data[0].id);
                    }
                } catch (error) {
                    console.error('Erro ao buscar categorias:', error.response?.data || error.message);
                    Alert.alert('Erro', 'Não foi possível carregar as categorias.');
                } finally {
                    setIsLoadingCategories(false);
                }
            }
        };
        fetchCategorias();
    }, [user, isAuthLoading, router]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCadastroProduto = async () => {
        if (!formData.nome || !formData.preco || categoriaSelecionada === null) { /* ... */ }

        // 4. Pega o token e o vendedorId diretamente do contexto
        if (!user || !user.vendedorId) {
            Alert.alert('Erro de Autenticação', 'Não foi possível identificar o vendedor. Por favor, faça login novamente.');
            return;
        }

        try {
            const payload = {
                nome: formData.nome,
                descricao: formData.descricao,
                imageUrl: formData.imageUrl,
                preco: parseFloat(formData.preco.replace(',', '.')),
                vendedorUsuarioId: user.vendedorId, // USA O ID DO VENDEDOR DO CONTEXTO
                categoriaIds: [categoriaSelecionada],
            };
            await axios.post(`${API_URL}/produtos`, payload, {
                headers: { 'Authorization': `Bearer ${user.token}` } // USA O TOKEN DO CONTEXTO
            });
            Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
            router.back();
        } catch (error) {
            console.error('Detalhes do erro:', error.response?.data || error.message);
            Alert.alert('Erro', 'Não foi possível cadastrar o produto.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
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

            {isLoadingCategories ? (
                <ActivityIndicator size="large" color="#fff" />
            ) : (
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={categoriaSelecionada}
                        onValueChange={(itemValue) => setCategoriaSelecionada(itemValue)}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        {categorias.length === 0 ? (
                            <Picker.Item label="Nenhuma categoria disponível" value={null} />
                        ) : (
                            categorias.map((categoria) => (
                                <Picker.Item key={categoria.id} label={categoria.nome} value={categoria.id} />
                            ))
                        )}
                    </Picker>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleCadastroProduto}>
                <Text style={styles.buttonText}>Cadastrar Produto</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

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
    pickerContainer: {
            backgroundColor: 'white',
            borderRadius: 30,
            marginBottom: 15,
            overflow: 'hidden',
            borderWidth: 0, // Define a largura da borda
            borderColor: 'white', // Define a cor da borda como branca
        },
        picker: {
            height: 50,
            width: '100%',
            color: '#333',
            backgroundColor: 'white',
        },
        pickerItem: {
            color: '#333',
            fontSize: 16,
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