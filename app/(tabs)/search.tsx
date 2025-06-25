import React, { useState } from 'react';
import { View, TextInput, FlatList } from 'react-native';
import { AnimeCard } from '../components/AnimeCard';
import { searchAnime } from '../services/apiService';
import tw from 'twrnc';

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = async (text: string) => {
        setQuery(text);
        if (text.length > 2) {
            const data = await searchAnime(text);
            setResults(data);
        } else {
            setResults([]);
        }
    };

    return (
        <View style={tw`flex-1 p-4`}>
            <TextInput
                style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
                placeholder="Rechercher un anime..."
                value={query}
                onChangeText={handleSearch}
            />
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AnimeCard
                        anime={item}
                        onPress={() => console.log('Navigate to anime details', item.id)}
                    />
                )}
                contentContainerStyle={tw`pb-4`}
            />
        </View>
    );
}