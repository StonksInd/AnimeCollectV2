import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { fetchAnimeById, fetchEpisodesByAnimeId } from '../services/apiService';
import { useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import ProgressBar from '../components/ProgressBar';
import EpisodeCard from '../components/EpisodeCard';
import { useDatabase } from '../hooks/useDatabase';

export default function AnimeDetails() {
    const { id } = useLocalSearchParams();
    const [anime, setAnime] = useState<any>(null);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCollection, getWatchedEpisodes } = useDatabase();
    const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const animeData = await fetchAnimeById(id as string);
            const episodesData = await fetchEpisodesByAnimeId(id as string);
            const watched = await getWatchedEpisodes(id as string);

            setAnime(animeData);
            setEpisodes(episodesData);
            setWatchedEpisodes(watched);
            setLoading(false);
        };
        loadData();
    }, [id]);

    const handleAddToCollection = async () => {
        if (anime) {
            await addToCollection(anime);
            alert('Ajouté à votre collection!');
        }
    };

    if (loading || !anime) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const watchedCount = watchedEpisodes.length;
    const progress = anime.attributes.episodeCount > 0
        ? (watchedCount / anime.attributes.episodeCount) * 100
        : 0;

    return (
        <ScrollView style={tw`flex-1 p-4`}>
            <View style={tw`flex-row mb-4`}>
                <Image
                    source={{ uri: anime.attributes.posterImage?.medium || 'https://via.placeholder.com/150' }}
                    style={tw`w-32 h-48 rounded-lg`}
                />
                <View style={tw`ml-4 flex-1`}>
                    <Text style={tw`text-2xl font-bold`}>{anime.attributes.canonicalTitle}</Text>
                    <Text style={tw`text-gray-500 mb-2`}>{anime.attributes.episodeCount} épisodes</Text>
                    <ProgressBar progress={progress} />
                    <Text style={tw`text-sm text-gray-500`}>{watchedCount} / {anime.attributes.episodeCount} épisodes</Text>

                    <TouchableOpacity
                        onPress={handleAddToCollection}
                        style={tw`bg-blue-500 py-2 px-4 rounded-lg mt-4`}
                    >
                        <Text style={tw`text-white text-center`}>Ajouter à ma collection</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={tw`text-lg font-bold mb-2`}>Synopsis</Text>
            <Text style={tw`text-gray-700 mb-6`}>{anime.attributes.synopsis || 'Aucun synopsis disponible.'}</Text>

            <Text style={tw`text-lg font-bold mb-2`}>Épisodes</Text>
            {episodes.map((episode) => (
                <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    isWatched={watchedEpisodes.includes(episode.id)}
                    onToggleWatched={() => console.log('Toggle watched', episode.id)}
                />
            ))}
        </ScrollView>
    );
}