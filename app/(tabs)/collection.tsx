import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { AnimeCard } from '../components/AnimeCard';
import { useDatabase } from '../hooks/useDatabase';
import tw from 'twrnc';

export default function CollectionScreen() {
    const [collection, setCollection] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { getCollection } = useDatabase();

    useEffect(() => {
        const loadCollection = async () => {
            const data = await getCollection();
            setCollection(data);
            setLoading(false);
        };
        loadCollection();
    }, []);

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={tw`flex-1 p-4`}>
            <Text style={tw`text-2xl font-bold mb-4`}>Ma Collection</Text>
            {collection.length === 0 ? (
                <Text style={tw`text-center mt-8 text-gray-500`}>
                    Votre collection est vide. Ajoutez des animés depuis l'écran de recherche.
                </Text>
            ) : (
                <FlatList
                    data={collection}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AnimeCard
                            anime={item}
                            onPress={() => console.log('Navigate to anime details', item.id)}
                        />
                    )}
                    contentContainerStyle={tw`pb-4`}
                />
            )}
        </View>
    );
}