import {Stack} from 'expo-router';
import 'react-native-reanimated';
import {AuthProvider} from "@/context/authContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{
                headerShown: false
            }}>
                {/* Tela de autenticação, não tem a barra de abas */}
                <Stack.Screen name="auth" />

                <Stack.Screen name="index" />
                <Stack.Screen name="+not-found" />

                {/* Rota que representa to.do o seu Tab Navigator */}
                <Stack.Screen name="(tabs)" />

                {/* A tela de detalhes do produto. Terá um header com botão de voltar. */}
                <Stack.Screen
                    name="produtos/[id]"
                    options={{
                        headerShown: true, // Mostra o header nesta tela
                        title: 'Detalhes do Produto',
                        headerStyle: { backgroundColor: '#F57C00' },
                        headerTintColor: 'white',
                    }}
                />
                {/* A tela de criar categoria. Terá um header com botão de voltar. */}
                <Stack.Screen
                    name="categorias/new"
                    options={{
                        headerShown: true, // Mostra o header nesta tela
                        title: 'Criar nova categoria',
                        headerStyle: { backgroundColor: '#F57C00' },
                        headerTintColor: 'white',
                    }}
                />

                {/* A tela de criar categoria. Terá um header com botão de voltar. */}
                <Stack.Screen
                    name="produtos/new"
                    options={{
                        headerShown: true, // Mostra o header nesta tela
                        title: 'Criar novo produto',
                        headerStyle: { backgroundColor: '#F57C00' },
                        headerTintColor: 'white',
                    }}
                />
            </Stack>
        </AuthProvider>
    )
}