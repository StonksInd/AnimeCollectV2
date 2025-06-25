import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import AnimeCard from './components/AnimeCard';
import { fetchCurrentlyAiringAnime } from './services/apiService';
import tw from 'twrnc';

export default function HomeScreen() {
    const [animeList, setAnimeList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnime = async () => {
            const data = await fetchCurrentlyAiringAnime();
            setAnimeList(data);
            setLoading(false);
        };
        loadAnime();
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
            <Text style={tw`text-2xl font-bold mb-4`}>Nouveautés</Text>
            <FlatList
                data={animeList}
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