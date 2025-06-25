import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import 'expo-router/entry';

const ctx = require.context('./app');
export function App() {
    return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);