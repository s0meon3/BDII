import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, TextInput, StyleSheet, SafeAreaView,
    StatusBar, Alert, FlatList, ActivityIndicator, Image,
    TouchableOpacity
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

const API_URL = 'http://127.0.0.1:8080';

const ProductCard = ({ product, onPress }) => {
    const categoryTag = product.categorias && product.categorias.length > 0 ? product.categorias[0].nome : null;

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.card}>
                <View style={styles.cardTopRow}>
                    <View style={styles.titleRatingContainer}>
                        <Text style={styles.productName}>{product.nome}</Text>
                        <FontAwesome name="star" size={16} color="#FFD700" style={{ marginLeft: 8 }} />
                        <Text style={styles.ratingText}>{product.avaliacaoMedia.toFixed(1)}</Text>
                    </View>
                    {categoryTag && (
                        <View style={styles.categoryTag}>
                            <Text style={styles.categoryTagText}>{categoryTag}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardMiddleRow}>
                    <Text style={styles.descriptionText}>{product.descricao}</Text>
                    <Image
                        source={{ uri: product.imageUrl || 'https://via.placeholder.com/80' }}
                        style={styles.productImage}
                    />
                </View>

                <View style={styles.cardBottomRow}>
                    <Text style={styles.priceText}>R$ {product.preco.toFixed(2).replace('.', ',')}</Text>
                    <Text style={styles.sellerText}>Vendido por: {product.vendedor.nomeTenda}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function ProductsScreen() {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter(); // Hook para controlar a navegação

    const fetchProducts = async () => {
        setIsLoading(true);

        try {
            const token = await AsyncStorage.getItem('userToken');

            if (!token) {
                Alert.alert("Sessão expirada", "Por favor, faça o login novamente.");
                router.replace('/auth');
                return;
            }

            const response = await axios.get(`${API_URL}/produtos/procurar`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAllProducts(response.data);
            setFilteredProducts(response.data);
        } catch (error) {
            if (axios.isAxiosError(error) && (error.response?.status === 403)) {
                Alert.alert("Sessão inválida", "Sua sessão expirou ou é inválida. Faça o login.");
                await AsyncStorage.removeItem('userToken');
                router.replace('/auth');
            } else {
                console.error('Erro ao buscar produtos:', error);
                Alert.alert('Erro', 'Não foi possível carregar os produtos.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(useCallback(() => {
        fetchProducts();
    }, []));

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        if (query.trim() === '') {
            setFilteredProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p =>
                p.nome.toLowerCase().includes(query) ||
                p.vendedor.nomeTenda.toLowerCase().includes(query) ||
                p.categorias.some(c => c.nome.toLowerCase().includes(query))
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, allProducts]);

    // Função chamada ao clicar em um produto
    const handleProductPress = (productId) => {
        router.push(`/produtos/${productId}`);
    };

    // Função para navegar para a tela de adicionar novo produto
    const handleAddProductPress = () => {
        router.push('/produtos/new');
    };

    // FUNÇÃO ADICIONADA: Navegar para a tela de adicionar nova categoria
    const handleAddCategoryPress = () => {
        router.push('/categorias/new');
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <ActivityIndicator size="large" color="white" style={{ flex: 1 }}/>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Procuro comidas, tendas ou vendedores"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <FontAwesome name="search" size={20} color="#777" style={styles.searchIcon} />
                </View>

                {/* Botões para Adicionar */}
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.addButton} onPress={handleAddProductPress}>
                        <FontAwesome name="plus-circle" size={24} color="white" />
                        <Text style={styles.addButtonText}>Novo Produto</Text>
                    </TouchableOpacity>

                    {/* NOVO BOTÃO: Adicionar Nova Categoria */}
                    <TouchableOpacity style={styles.addButton} onPress={handleAddCategoryPress}>
                        <FontAwesome name="tags" size={24} color="white" />
                        <Text style={styles.addButtonText}>Nova Categoria</Text>
                    </TouchableOpacity>
                </View>


                <FlatList
                    data={filteredProducts}
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            onPress={() => handleProductPress(item.id)}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto encontrado.</Text>}
                />
            </View>
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
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
        margin: 16,
        paddingHorizontal: 15,
    },
    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    searchIcon: {
        marginLeft: 10,
    },
    // Contêiner para os botões de adicionar
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Distribui os botões uniformemente
        marginHorizontal: 16,
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        backgroundColor: '#1E88E5', // Um tom de azul para o botão
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 15, // Ajustado para ter mais espaço em botões múltiplos
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flex: 1, // Faz com que os botões ocupem o espaço disponível
        marginHorizontal: 5, // Espaçamento entre os botões
    },
    addButtonText: {
        color: 'white',
        fontSize: 14, // Fonte um pouco menor para caber em botões múltiplos
        fontWeight: 'bold',
        marginLeft: 8, // Ajuste o espaçamento do ícone
    },
    card: {
        backgroundColor: '#A14900',
        borderRadius: 15,
        padding: 15,
        marginBottom: 16,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    ratingText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 4,
    },
    categoryTag: {
        backgroundColor: '#F57C00',
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    categoryTagText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardMiddleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    descriptionText: {
        flex: 1,
        color: '#FFCCBC',
        fontSize: 14,
        marginRight: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#E0E0E0' // Cor de fundo para o placeholder
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    sellerText: {
        color: '#FFCCBC',
        fontSize: 13,
    },
    emptyText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    }
});