import axios from 'axios';

const BASE_URL = 'https://kitsu.io/api/edge';

export const fetchCurrentlyAiringAnime = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/anime`, {
      params: {
        'filter[status]': 'current',
        'sort': '-startDate',
        'page[limit]': 20,
        'include': 'categories'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching current anime:', error);
    return [];
  }
};

export const fetchAnimeById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching anime ${id}:`, error);
    return null;
  }
};

export const searchAnime = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime`, {
      params: {
        'filter[text]': query,
        'page[limit]': 20
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

export const fetchEpisodesByAnimeId = async (animeId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/anime/${animeId}/episodes`, {
      params: {
        'page[limit]': 50,
        'sort': 'number'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching episodes for anime ${animeId}:`, error);
    return [];
  }
};

export const fetchEpisodeById = async (episodeId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/episodes/${episodeId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching episode ${episodeId}:`, error);
    return null;
  }
};