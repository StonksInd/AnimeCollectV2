import { SQLiteDatabase } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { useEffect } from 'react';
import { useState } from 'react';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';

export function useDatabase() {
    const [ready, setReady] = useState(false);
    const expoDb = openDatabaseSync('anime.db');
    const db = drizzle(expoDb);
    useEffect(() => {
        // Créer les tables si elles n'existent pas
        db.run(`
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
        
        db.run(`
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
        
        setReady(true);
    }, []);

    const addToCollection = async (anime: any) => {
        return db.insert(schema.anime).values({
            id: anime.id,
            title: anime.attributes.canonicalTitle,
            posterImage: anime.attributes.posterImage?.medium,
            synopsis: anime.attributes.synopsis,
            episodeCount: anime.attributes.episodeCount,
            status: anime.attributes.status,
            averageRating: anime.attributes.averageRating,
        }).onConflictDoNothing().run();
    };

    const getCollection = async () => {
        return db.select().from(schema.anime).all();
    };

    const markEpisodeAsWatched = async (episodeId: string, animeId: string, episodeData?: any) => {
        if (episodeData) {
            return db.insert(schema.episodes).values({
                id: episodeId,
                animeId,
                number: episodeData.attributes.number,
                title: episodeData.attributes.canonicalTitle,
                synopsis: episodeData.attributes.synopsis,
                watched: true,
            }).onConflictDoUpdate({
                target: schema.episodes.id,
                set: { watched: true }
            }).run();
        } else {
            return db.update(schema.episodes)
                .set({ watched: true })
                .where(eq(schema.episodes.id, episodeId))
                .run();
        }
    };

    const isEpisodeWatched = async (episodeId: string) => {
        const result = await db.select()
            .from(schema.episodes)
            .where(eq(schema.episodes.id, episodeId))
            .get();
        return !!result?.watched;
    };

    const getWatchedEpisodes = async (animeId: string) => {
        const results = await db.select({ id: schema.episodes.id })
            .from(schema.episodes)
            .where(eq(schema.episodes.animeId, animeId))
            .all();
        return results.map(r => r.id);
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

function setReady(arg0: boolean) {
    throw new Error('Function not implemented.');
}
