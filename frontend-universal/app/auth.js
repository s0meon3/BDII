import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
    StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView, Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '@/context/authContext';

const API_URL = 'http://192.168.0.13:8080';

// Componente para o formulário de Login (inalterado)
const LoginForm = ({ onAuthSuccess }) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { signIn } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, senha });

            await signIn(response.data); // response.data contém { token, vendedorID }

            Alert.alert('Sucesso', 'Conectado com sucesso!');
            onAuthSuccess(); // Chama a função para navegar para a próxima tela

        } catch (error) {
            console.error("Erro no login:", error.response?.data || error.message);
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

// Componente para o formulário de Cadastro (modificado)
const RegisterForm = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        curso: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        tipoUsuario: 'comprador', // Valor padrão
        // Campos específicos para vendedor
        nomeTenda: '',
        horarioInicio: '', // Pode ser string "HH:MM"
        horarioFim: '',    // Pode ser string "HH:MM"
        fazEntrega: false,
        telefone: ''
    });

    const handleChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

    const handleRegister = async () => {
        if (formData.senha !== formData.confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        // Validação básica para campos comuns
        if (!formData.nome || !formData.email || !formData.senha || !formData.cpf) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (formData.tipoUsuario === 'vendedor') {
            if (!formData.nomeTenda || !formData.telefone) {
                Alert.alert('Erro', 'Para vendedores, "Nome da Tenda" e "Telefone" são obrigatórios.');
                return;
            }
            // Validação de horários (opcional, mas recomendado)
            const horaInicioValida = /^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.horarioInicio);
            const horaFimValida = /^([01]\d|2[0-3]):([0-5]\d)$/.test(formData.horarioFim);

            if (formData.horarioInicio && !horaInicioValida) {
                Alert.alert('Erro', 'Formato de "Horário de Início" inválido. Use HH:MM.');
                return;
            }
            if (formData.horarioFim && !horaFimValida) {
                Alert.alert('Erro', 'Formato de "Horário de Fim" inválido. Use HH:MM.');
                return;
            }
        }

        try {
            const commonPayload = {
                nome: formData.nome,
                cpf: formData.cpf,
                curso: formData.curso,
                email: formData.email,
                senha: formData.senha,
                tipoUsuario: formData.tipoUsuario,
            };

            let response;
            if (formData.tipoUsuario === 'vendedor') {
                const vendedorPayload = {
                    nomeTenda: formData.nomeTenda,
                    horarioInicio: formData.horarioInicio || null, // Envia null se vazio
                    horarioFim: formData.horarioFim || null,       // Envia null se vazio
                    fazEntrega: formData.fazEntrega,
                    telefone: formData.telefone,
                    ativo: true,                };
                // Combina os dados do usuário e vendedor
                const fullPayload = { ...commonPayload, ...vendedorPayload };
                console.log(fullPayload)
                // console.log("Payload Vendedor:", fullPayload); // Para debug
                response = await axios.post(`${API_URL}/auth/register`, fullPayload); // Endpoint para registro de vendedor
            } else {
                // console.log("Payload Comprador:", commonPayload); // Para debug
                response = await axios.post(`${API_URL}/auth/register`, commonPayload); // Endpoint para registro de comprador
            }

            Alert.alert('Sucesso', 'Conta criada! Faça o login para continuar.');
            onSwitchToLogin();
        } catch (error) {
            console.error('Erro no registro:', error.response?.data || error.message);
            Alert.alert('Erro', error.response?.data?.message || 'Não foi possível criar a conta. Tente novamente.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.formTitle}>Cadastre sua conta</Text>

            {/* Seletor de Tipo de Usuário */}
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={formData.tipoUsuario}
                    onValueChange={(itemValue) => handleChange('tipoUsuario', itemValue)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label="Comprador" value="comprador" />
                    <Picker.Item label="Vendedor" value="vendedor" />
                </Picker>
            </View>

            {/* Campos Comuns */}
            <TextInput
                style={styles.input}
                placeholder="Nome Completo"
                placeholderTextColor="#aaa"
                value={formData.nome}
                onChangeText={v => handleChange('nome', v)}
            />
            <TextInput
                style={styles.input}
                placeholder="CPF (apenas números)"
                placeholderTextColor="#aaa"
                keyboardType="numeric"
                value={formData.cpf}
                onChangeText={v => handleChange('cpf', v)}
            />
            <TextInput
                style={styles.input}
                placeholder="Curso (ex: Engenharia, Enfermagem)"
                placeholderTextColor="#aaa"
                value={formData.curso}
                onChangeText={v => handleChange('curso', v)}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={v => handleChange('email', v)}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={formData.senha}
                onChangeText={v => handleChange('senha', v)}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                placeholderTextColor="#aaa"
                secureTextEntry
                value={formData.confirmarSenha}
                onChangeText={v => handleChange('confirmarSenha', v)}
            />

            {/* Campos Específicos para Vendedor */}
            {formData.tipoUsuario === 'vendedor' && (
                <>
                    <Text style={styles.sectionTitle}>Dados do Vendedor</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome da Tenda"
                        placeholderTextColor="#aaa"
                        value={formData.nomeTenda}
                        onChangeText={v => handleChange('nomeTenda', v)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Telefone (WhatsApp)"
                        placeholderTextColor="#aaa"
                        keyboardType="phone-pad"
                        value={formData.telefone}
                        onChangeText={v => handleChange('telefone', v)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Horário de Início (HH:MM - ex: 08:00)"
                        placeholderTextColor="#aaa"
                        value={formData.horarioInicio}
                        onChangeText={v => handleChange('horarioInicio', v)}
                        maxLength={5}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Horário de Fim (HH:MM - ex: 18:30)"
                        placeholderTextColor="#aaa"
                        value={formData.horarioFim}
                        onChangeText={v => handleChange('horarioFim', v)}
                        maxLength={5}
                        keyboardType="numeric"
                    />
                    <View style={styles.switchContainer}>
                        <Text style={styles.switchLabel}>Faz Entrega?</Text>
                        <Switch
                            onValueChange={v => handleChange('fazEntrega', v)}
                            value={formData.fazEntrega}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={formData.fazEntrega ? "#f5dd4b" : "#f4f3f4"}
                        />
                    </View>
                </>
            )}

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// Tela Principal de Autenticação (inalterado)
export default function AuthScreen() {
    const [activeTab, setActiveTab] = useState('login');
    const router = useRouter();

    const handleAuthSuccess = () => {
        router.replace('/(tabs)/home');
    };

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

// Folha de Estilos (adicionados novos estilos)
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
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    tabText: {
        color: '#FFCCBC',
        fontSize: 18,
        paddingBottom: 5,
    },
    activeTabText: {
        color: 'white',
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
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20, // Garante que o scroll chegue até o final
    },
    // Estilos para o Picker
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 30,
        marginBottom: 15,
        overflow: 'hidden',
        borderWidth: 0,
        borderColor: 'white',
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
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    switchLabel: {
        color: '#333',
        fontSize: 16,
    },
});