import React from 'react';
import {Redirect, Tabs} from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import {useAuth} from "@/context/authContext";
import {ActivityIndicator, View} from "react-native";

export default function TabLayout() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F57C00' }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/auth" />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#F57C00', // Cor do ícone ativo
                tabBarInactiveTintColor: '#777', // Cor do ícone inativo
                headerShown: false, // Vamos ocultar o header padrão das abas
                tabBarStyle: {
                    backgroundColor: 'white',
                    height: 60,
                    paddingBottom: 10,
                }
            }}
        >
            <Tabs.Screen
                name="home" // Corresponde ao arquivo (tabs)/produtos/home.js
                options={{
                    title: 'Buscar',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="usuario/profile" // Corresponde ao arquivo (tabs)/usuario/profile.js
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}