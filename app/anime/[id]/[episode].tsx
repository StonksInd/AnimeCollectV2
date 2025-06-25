import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { fetchEpisodeById } from '../../services/apiService';
import { useLocalSearchParams } from 'expo-router';
import tw from 'twrnc';
import { useDatabase } from '../../hooks/useDatabase';

export default function EpisodeDetails() {
    const { id, episode } = useLocalSearchParams();
    const [episodeData, setEpisodeData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { markEpisodeAsWatched, isEpisodeWatched } = useDatabase();
    const [isWatched, setIsWatched] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchEpisodeById(episode as string);
            const watched = await isEpisodeWatched(episode as string);

            setEpisodeData(data);
            setIsWatched(watched);
            setLoading(false);
        };
        loadData();
    }, [episode]);

    const handleToggleWatched = async () => {
        if (episodeData) {
            await markEpisodeAsWatched(episode as string, id as string);
            setIsWatched(!isWatched);
        }
    };

    if (loading || !episodeData) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView style={tw`flex-1 p-4`}>
            <Image
                source={{ uri: episodeData.attributes.thumbnail?.original || 'https://via.placeholder.com/300' }}
                style={tw`w-full h-48 rounded-lg mb-4`}
            />

            <Text style={tw`text-2xl font-bold mb-2`}>
                Épisode {episodeData.attributes.number}: {episodeData.attributes.canonicalTitle}
            </Text>

            <Text style={tw`text-gray-500 mb-4`}>
                Diffusé le: {new Date(episodeData.attributes.airdate).toLocaleDateString()}
            </Text>

            <TouchableOpacity
                onPress={handleToggleWatched}
                style={tw`${isWatched ? 'bg-green-500' : 'bg-gray-300'} py-2 px-4 rounded-lg mb-6`}
            >
                <Text style={tw`text-white text-center`}>
                    {isWatched ? '✓ Épisode vu' : 'Marquer comme vu'}
                </Text>
            </TouchableOpacity>

            <Text style={tw`text-lg font-bold mb-2`}>Synopsis</Text>
            <Text style={tw`text-gray-700 mb-6`}>
                {episodeData.attributes.synopsis || 'Aucun synopsis disponible pour cet épisode.'}
            </Text>
        </ScrollView>
    );
}