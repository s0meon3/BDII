import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
    return (
        <>
            {/* O Stack vai gerenciar todas as telas do seu app */}
            <Stack screenOptions={{
                // Você pode definir estilos globais para o header aqui
                headerStyle: {
                    backgroundColor: '#F57C00', // Cor de fundo do header
                },
                headerTintColor: '#fff', // Cor do texto e ícones do header
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
                {/* A tela 'index' apenas redireciona, então não precisa de um título */}
                <Stack.Screen name="index" options={{ headerShown: false }} />

                {/* Tela de autenticação */}
                <Stack.Screen name="auth" options={{ headerShown: false }} />

                {/* Tela de perfil do usuário */}
                <Stack.Screen
                    name="usuario/profile"
                    options={{
                        title: 'Meu Perfil', // Título que aparecerá no header
                    }}
                />

                {/* Tela de 'não encontrado' que o Expo Router usa por padrão */}
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="light" />
        </>
    );
}
