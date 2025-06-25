import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

export default function ProgressBar({ progress }: { progress: number }) {
    return (
        <View style={tw`h-4 bg-gray-200 rounded-full overflow-hidden mt-2`}>
            <View
                style={[
                    tw`h-full bg-blue-500`,
                    { width: `${Math.min(100, Math.max(0, progress))}%` }
                ]}
            />
        </View>
    );
}