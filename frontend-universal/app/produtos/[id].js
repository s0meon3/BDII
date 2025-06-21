import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, StatusBar,
    ActivityIndicator, Image, TouchableOpacity, Linking, Alert
} from 'react-native';
import {useLocalSearchParams, Stack} from 'expo-router';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/context/authContext';

const API_URL = 'http://192.168.0.13:8080';

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const { user, signOut } = useAuth(); // 2. USAR O CONTEXTO
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id || !user) {
            return;
        }

        const fetchProductDetail = async () => {
            setIsLoading(true);
            try {
                // 3. Pega o token diretamente do objeto 'user' do contexto
                const response = await axios.get(`${API_URL}/produtos/${id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setProduct(response.data);
            } catch (error) {
                // 4. Centraliza o tratamento de erro de autenticação
                if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                    Alert.alert("Sessão Inválida", "Por favor, faça o login novamente.");
                    await signOut(); // O signOut já lida com a limpeza e o AuthProvider redirecionará
                } else {
                    console.error("Erro ao buscar detalhes do produto:", error);
                    Alert.alert("Erro", "Não foi possível carregar os detalhes do produto.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProductDetail();
    }, [id, user, signOut]);

    const handleWhatsAppPress = () => {
        if (!product?.vendedor?.telefone) {
            Alert.alert("Erro", "O vendedor não possui um número de telefone cadastrado.");
            return;
        }
        const phoneNumber = product.vendedor.telefone;
        const message = `Olá! Tenho interesse no produto *${product.nome}*. Podemos conversar?`;

        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

        Linking.openURL(url).catch(() => {
            Alert.alert('Erro', 'Não foi possível abrir o WhatsApp. Verifique se o aplicativo está instalado.');
        });
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color="#F57C00" style={{ flex: 1 }} />;
    }

    if (!product) {
        return <View><Text>Produto não encontrado.</Text></View>;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ title: "Escolha de Pedido" }} />
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.cardTopRow}>
                        <Text style={styles.productName}>{product.nome}</Text>
                        <FontAwesome name="star" size={16} color="#FFD700" style={{ marginLeft: 8 }} />
                        <Text style={styles.ratingText}>{product.avaliacaoMedia.toFixed(1)}</Text>
                    </View>
                    <View style={styles.cardMiddleRow}>
                        <Text style={styles.descriptionText}>{product.descricao}</Text>
                        <Image source={{ uri: product.imageUrl || 'https://via.placeholder.com/80' }} style={styles.productImage} />
                    </View>
                    <View style={styles.cardBottomRow}>
                        <Text style={styles.priceText}>R$ {product.preco.toFixed(2).replace('.', ',')}</Text>
                        <Text style={styles.sellerText}>Vendido por: {product.vendedor.nomeTenda}</Text>
                    </View>
                    <View style={styles.separator} />
                    <Text style={styles.sellerInfoText}>
                        Horário do vendedor: {product.vendedor.horarioInicio} às {product.vendedor.horarioFim}
                    </Text>
                    <Text style={styles.sellerInfoText}>
                        Status do vendedor: {product.vendedor.ativo ? 'Ativo' : 'Inativo'}
                    </Text>

                    <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppPress}>
                        <FontAwesome name="whatsapp" size={20} color="#25D366" />
                        <Text style={styles.whatsappButtonText}>Chamar via WhatsApp</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#DD6B20' },
    container: { flex: 1, backgroundColor: '#F57C00', padding: 16 },
    card: { backgroundColor: '#A14900', borderRadius: 15, padding: 15 },
    cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    productName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    ratingText: { color: 'white', fontWeight: 'bold', fontSize: 15, marginLeft: 4 },
    cardMiddleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    descriptionText: { flex: 1, color: '#FFCCBC', fontSize: 14, marginRight: 10 },
    productImage: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#E0E0E0' },
    cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    priceText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    sellerText: { color: '#FFCCBC', fontSize: 13 },
    separator: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 },
    sellerInfoText: { color: 'white', fontSize: 14, marginBottom: 8 },
    whatsappButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', borderRadius: 30, paddingVertical: 15, marginTop: 15 },
    whatsappButtonText: { color: '#333', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});