import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

export default function AnimeCard({ anime, onPress }: {
    anime: any,
    onPress: () => void
}) {
    const posterImage = anime.attributes.posterImage?.medium || 'https://via.placeholder.com/150';

    return (
        <TouchableOpacity
            onPress={onPress}
            style={tw`bg-white rounded-lg shadow-md overflow-hidden mb-4`}
        >
            <Image
                source={{ uri: posterImage }}
                style={tw`w-full h-48`}
                resizeMode="cover"
            />
            <View style={tw`p-3`}>
                <Text style={tw`text-lg font-bold`}>
                    {anime.attributes.canonicalTitle}
                </Text>
                <Text style={tw`text-gray-500`}>
                    {anime.attributes.episodeCount} épisodes
                </Text>
                <Text style={tw`text-gray-500`}>
                    Note: {anime.attributes.averageRating || 'N/A'}
                </Text>
            </View>
        </TouchableOpacity>
    );
}