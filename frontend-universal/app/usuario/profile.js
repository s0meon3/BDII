import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
    StatusBar, Alert, ScrollView, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons'; // Para o ícone de lápis
import {useFocusEffect, useRouter} from 'expo-router';

// IMPORTANTE: Use o mesmo IP da sua máquina que está no outro arquivo.
const API_URL = 'http://192.168.0.13:8080';

// Componente reutilizável para cada campo de informação
const InfoField = ({ label, value, editable, onChangeText, isPassword = false }) => (
    <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                value={value}
                editable={editable}
                onChangeText={onChangeText}
                placeholder={isPassword ? "Digite a nova senha" : ""}
                placeholderTextColor="#aaa"
                secureTextEntry={isPassword}
            />
            {!isPassword && <FontAwesome name="pencil" size={18} color="white" />}
        </View>
    </View>
);


export default function ProfileScreen() {
    const [userData, setUserData] = useState({
        nome: '',
        cpf: '',
        curso: '',
        email: '',
    });
    const [originalUserData, setOriginalUserData] = useState({});
    const [senha, setSenha] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    // Função para buscar os dados do usuário
    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert("Erro", "Você não está autenticado.");
                router.replace('/auth');
                return;
            }

            const response = await axios.get(`${API_URL}/usuario/perfil`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setUserData(response.data);
            setOriginalUserData(response.data); // Salva o estado original para o "cancelar"

        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            Alert.alert('Erro', 'Não foi possível carregar seus dados.');
        } finally {
            setIsLoading(false);
        }
    };

    // useFocusEffect garante que os dados sejam recarregados toda vez que a tela entra em foco
    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

    const handleUpdate = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const payload = { ...userData };
            if (senha) { // Apenas envia a senha se ela foi alterada
                payload.senha = senha;
            }

            await axios.put(`${API_URL}/usuario/atualizar`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            Alert.alert('Sucesso', 'Dados atualizados!');
            setIsEditing(false);
            setSenha(''); // Limpa o campo de senha
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            Alert.alert('Erro', 'Não foi possível atualizar seus dados.');
        }
    };

    const handleCancel = () => {
        setUserData(originalUserData); // Restaura os dados originais
        setIsEditing(false);
        setSenha('');
    };

    const handleChange = (name, value) => {
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Gerencie seus dados</Text>

                <View style={styles.form}>
                    <InfoField label="Nome" value={userData.nome} editable={isEditing} onChangeText={(v) => handleChange('nome', v)} />
                    <InfoField label="CPF" value={userData.cpf} editable={false} /> {/* CPF geralmente não é editável */}
                    <InfoField label="Curso" value={userData.curso} editable={isEditing} onChangeText={(v) => handleChange('curso', v)} />
                    <InfoField label="Email" value={userData.email} editable={isEditing} onChangeText={(v) => handleChange('email', v)} />
                    <InfoField label="Senha" value={senha} editable={isEditing} onChangeText={setSenha} isPassword={true} />

                    <View style={styles.buttonContainer}>
                        {isEditing ? (
                            <>
                                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdate}>
                                    <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                                <Text style={styles.buttonText}>Editar Dados</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Folha de Estilos
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F57C00', // Laranja principal
    },
    container: {
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    form: {
        backgroundColor: '#E65100', // Laranja mais escuro
        borderRadius: 20,
        padding: 20,
    },
    fieldContainer: {
        marginBottom: 15,
    },
    label: {
        color: '#FFCCBC', // Laranja claro para o label
        fontSize: 14,
        marginBottom: 5,
        marginLeft: 15,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 30,
        paddingHorizontal: 20,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        paddingVertical: 12,
        height: 48,
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#E65100',
        fontSize: 18,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#4CAF50', // Um verde para salvar
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FFCCBC',
    },
    cancelButtonText: {
        color: '#FFCCBC',
    }
});