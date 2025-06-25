import { Stack } from 'expo-router';
import { View } from 'react-native';
import tw from 'twrnc';
import React from 'react';

export default function RootLayout() {
    return (
        <View style={tw`flex-1`}>
            <Stack screenOptions={{
                headerShown: false // Cache tous les headers par défaut
            }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                    name="anime/[id]"
                    options={{
                        headerShown: true,
                        title: 'Détails'
                    }}
                />
                <Stack.Screen
                    name="anime/[id]/[episode]"
                    options={{
                        headerShown: true,
                        title: 'Épisode'
                    }}
                />
            </Stack>
        </View>
    );
}