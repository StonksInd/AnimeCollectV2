import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';

export function useDatabase() {
    const [ready, setReady] = useState(false);
    const [db, setDb] = useState<any>(null);

    useEffect(() => {
        try {
            const expoDb = openDatabaseSync('anime.db');
            const database = drizzle(expoDb);
            
            // Créer les tables si elles n'existent pas
            expoDb.execSync(`
                CREATE TABLE IF NOT EXISTS anime (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    posterImage TEXT,
                    synopsis TEXT,
                    episodeCount INTEGER,
                    status TEXT,
                    averageRating TEXT
                );
            `);
            
            expoDb.execSync(`
                CREATE TABLE IF NOT EXISTS episodes (
                    id TEXT PRIMARY KEY,
                    anime_id TEXT NOT NULL,
                    number INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    synopsis TEXT,
                    watched INTEGER DEFAULT 0,
                    FOREIGN KEY (anime_id) REFERENCES anime(id)
                );
            `);
            
            setDb(database);
            setReady(true);
        } catch (error) {
            console.error('Database initialization error:', error);
        }
    }, []);

    const addToCollection = async (anime: any) => {
        if (!db) return;
        try {
            return await db.insert(schema.anime).values({
                id: anime.id,
                title: anime.attributes.canonicalTitle,
                posterImage: anime.attributes.posterImage?.medium,
                synopsis: anime.attributes.synopsis,
                episodeCount: anime.attributes.episodeCount,
                status: anime.attributes.status,
                averageRating: anime.attributes.averageRating,
            }).onConflictDoNothing();
        } catch (error) {
            console.error('Error adding to collection:', error);
        }
    };

    const getCollection = async () => {
        if (!db) return [];
        try {
            return await db.select().from(schema.anime).all();
        } catch (error) {
            console.error('Error getting collection:', error);
            return [];
        }
    };

    const markEpisodeAsWatched = async (episodeId: string, animeId: string, episodeData?: any) => {
        if (!db) return;
        try {
            if (episodeData) {
                return await db.insert(schema.episodes).values({
                    id: episodeId,
                    animeId,
                    number: episodeData.attributes.number,
                    title: episodeData.attributes.canonicalTitle,
                    synopsis: episodeData.attributes.synopsis,
                    watched: true,
                }).onConflictDoUpdate({
                    target: schema.episodes.id,
                    set: { watched: true }
                });
            } else {
                return await db.update(schema.episodes)
                    .set({ watched: true })
                    .where(eq(schema.episodes.id, episodeId));
            }
        } catch (error) {
            console.error('Error marking episode as watched:', error);
        }
    };

    const isEpisodeWatched = async (episodeId: string) => {
        if (!db) return false;
        try {
            const result = await db.select()
                .from(schema.episodes)
                .where(eq(schema.episodes.id, episodeId))
                .get();
            return !!result?.watched;
        } catch (error) {
            console.error('Error checking if episode is watched:', error);
            return false;
        }
    };

    const getWatchedEpisodes = async (animeId: string) => {
        if (!db) return [];
        try {
            const results = await db.select({ id: schema.episodes.id })
                .from(schema.episodes)
                .where(eq(schema.episodes.animeId, animeId))
                .all();
            return results.map(r => r.id);
        } catch (error) {
            console.error('Error getting watched episodes:', error);
            return [];
        }
    };

    return {
        ready,
        addToCollection,
        getCollection,
        markEpisodeAsWatched,
        isEpisodeWatched,
        getWatchedEpisodes,
    };
}