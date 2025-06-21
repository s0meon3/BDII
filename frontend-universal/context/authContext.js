import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Ao iniciar o app, tenta carregar o usuário a partir dos dados salvos
        async function loadUserFromStorage() {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const vendedorId = await AsyncStorage.getItem('vendedorId');

                if (token) {
                    const decodedToken = jwtDecode(token);
                    // Monta o objeto de usuário com todas as informações
                    setUser({
                        ...decodedToken, // email, cargo, etc.
                        token,
                        vendedorId: vendedorId ? parseInt(vendedorId) : null
                    });
                }
            } catch (e) {
                console.error("Falha ao carregar usuário do armazenamento", e);
                // Limpa em caso de erro de token inválido
                await AsyncStorage.multiRemove(['userToken', 'vendedorId']);
            } finally {
                setIsLoading(false);
            }
        }
        loadUserFromStorage();
    }, []);

    // Função de SignIn agora aceita o objeto de dados da API
    const signIn = async (authData) => {
        try {
            const { token, vendedorID } = authData;

            const decodedToken = jwtDecode(token);
            // Atualiza o estado global do usuário
            setUser({
                ...decodedToken,
                token,
                vendedorId: vendedorID || null
            });

            // Armazena no AsyncStorage
            await AsyncStorage.setItem('userToken', token);
            if (vendedorID) {
                await AsyncStorage.setItem('vendedorId', String(vendedorID));
            } else {
                await AsyncStorage.removeItem('vendedorId'); // Garante que não haja lixo
            }

        } catch (e) {
            console.error("Falha ao fazer login", e);
        }
    };

    const signOut = async () => {
        setUser(null);
        // Limpa todas as chaves relacionadas ao usuário
        await AsyncStorage.multiRemove(['userToken', 'vendedorId']);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook customizado para usar o contexto
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}