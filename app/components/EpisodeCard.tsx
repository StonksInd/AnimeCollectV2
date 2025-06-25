import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

export default function EpisodeCard({
    episode,
    isWatched,
    onToggleWatched,
}: {
    episode: any;
    isWatched: boolean;
    onToggleWatched: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onToggleWatched}
            style={tw`bg-white p-3 rounded-lg mb-2 border ${isWatched ? 'border-green-500' : 'border-gray-200'}`}
        >
            <View style={tw`flex-row justify-between items-center`}>
                <View>
                    <Text style={tw`font-medium`}>
                        Épisode {episode.attributes.number}: {episode.attributes.canonicalTitle}
                    </Text>
                    <Text style={tw`text-gray-500 text-sm`}>
                        {episode.attributes.length || '??'} min
                    </Text>
                </View>
                <View style={tw`w-5 h-5 rounded-full ${isWatched ? 'bg-green-500' : 'bg-gray-200'}`} />
            </View>
        </TouchableOpacity>
    );
}