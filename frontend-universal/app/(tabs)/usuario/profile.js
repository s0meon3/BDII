import React, { useState, useCallback } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
    Alert, ScrollView, ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'; // Para o ícone de lápis
import {useFocusEffect, useRouter} from 'expo-router';
import { useAuth } from '@/context/authContext';

// IMPORTANTE: Use o mesmo IP da sua máquina que está no outro arquivo.
const API_URL = 'http://localhost:8080';

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
    const { user, signOut } = useAuth();
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
    const fetchUserData = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            // 4. Pega o token diretamente do objeto 'user' do contexto
            const response = await axios.get(`${API_URL}/usuario/perfil`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setUserData(response.data);
            setOriginalUserData(response.data);
        } catch (error) {
            // 5. Se o token for inválido, o signOut do contexto será chamado
            if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                Alert.alert("Sessão Inválida", "Por favor, faça o login novamente.");
                await signOut(); // O signOut já lida com a limpeza e o AuthProvider redirecionará
            } else {
                console.error('Erro ao buscar dados do usuário:', error);
                Alert.alert('Erro', 'Não foi possível carregar seus dados.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [user, signOut]); // Adiciona signOut às dependências

    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [fetchUserData])
    );

    const handleLogout = async () => {
        await signOut();
    };

    const handleUpdate = async () => {
        try {
            if (!user) return;
            const payload = { ...userData };
            if (senha) { payload.senha = senha; }
            await axios.put(`${API_URL}/usuario/atualizar`, payload, {
                headers: { 'Authorization': `Bearer ${user.token}` } // USA O TOKEN DO CONTEXTO
            });
            Alert.alert('Sucesso', 'Dados atualizados!');
            setIsEditing(false);
            setSenha('');
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
        return ( <SafeAreaView style={styles.safeArea}><ActivityIndicator size="large" color="white" style={{ flex: 1 }} /></SafeAreaView> );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Gerencie seus dados</Text>
                <View style={styles.form}>
                    <InfoField label="Nome" value={userData.nome} editable={isEditing} onChangeText={(v) => handleChange('nome', v)} />
                    <InfoField label="CPF" value={userData.cpf} editable={false} />
                    <InfoField label="Curso" value={userData.curso} editable={isEditing} onChangeText={(v) => handleChange('curso', v)} />
                    <InfoField label="Email" value={userData.email} editable={isEditing} onChangeText={(v) => handleChange('email', v)} />
                    <InfoField label="Senha" value={senha} editable={isEditing} onChangeText={setSenha} isPassword={true} />
                    <View style={styles.buttonContainer}>{isEditing ? (<><TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdate}><Text style={styles.buttonText}>Salvar</Text></TouchableOpacity><TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}><Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text></TouchableOpacity></>) : (<TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}><Text style={styles.buttonText}>Editar Dados</Text></TouchableOpacity>)}</View>
                </View>

                <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Sair (Logout)</Text>
                </TouchableOpacity>
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
    logoutButton: {
        backgroundColor: '#D32F2F',
        marginHorizontal: 16,
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