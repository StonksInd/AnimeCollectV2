import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const anime = sqliteTable('anime', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  posterImage: text('posterImage'),
  synopsis: text('synopsis'),
  episodeCount: integer('episodeCount'),
  status: text('status'),
  averageRating: text('averageRating')
});

export const episodes = sqliteTable('episodes', {
  id: text('id').primaryKey(),
  animeId: text('anime_id').references(() => anime.id),
  number: integer('number').notNull(),
  title: text('title').notNull(),
  synopsis: text('synopsis'),
  watched: integer('watched', { mode: 'boolean' }).default(false)
});