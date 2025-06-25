import { useState } from 'react';
import { fetchCurrentlyAiringAnime, fetchAnimeById, fetchEpisodesByAnimeId, fetchEpisodeById, searchAnime } from '../services/apiService';

export default function useAnimeApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentlyAiring = async () => {
    setLoading(true);
    try {
      const data = await fetchCurrentlyAiringAnime();
      return data;
    } catch (err) {
      setError('Failed to fetch current anime');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAnimeById = async (id: string) => {
    setLoading(true);
    try {
      return await fetchAnimeById(id);
    } catch (err) {
      setError('Failed to fetch anime details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const search = async (query: string) => {
    setLoading(true);
    try {
      return await searchAnime(query);
    } catch (err) {
      setError('Failed to search anime');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getCurrentlyAiring,
    getAnimeById,
    search,
    fetchEpisodesByAnimeId,
    fetchEpisodeById,
  };
}