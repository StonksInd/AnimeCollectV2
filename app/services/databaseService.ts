import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from '../db/schema';
const expoDb = openDatabaseSync('anime.db');
const db = drizzle(expoDb, { schema });


export const addToCollection = async (anime: any) => {
  return db.insert(schema.anime).values({
    id: anime.id,
    title: anime.attributes.canonicalTitle,
    posterImage: anime.attributes.posterImage?.medium,
    synopsis: anime.attributes.synopsis,
    episodeCount: anime.attributes.episodeCount,
    status: anime.attributes.status,
    averageRating: anime.attributes.averageRating,
  }).run();
};

export const markEpisodeAsWatched = async (
  episodeId: string,
  animeId: string,
  number: number,
  title: string,
  synopsis?: string
) => {
  return db.insert(schema.episodes).values({
    id: episodeId,
    animeId,
    number,
    title,
    synopsis,
    watched: true,
  }).onConflictDoUpdate({
    target: schema.episodes.id,
    set: { watched: true }
  }).run();
};