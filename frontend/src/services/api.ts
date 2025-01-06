import axios, { AxiosError } from 'axios';
import { CreateItemDto, Item, UpdateItemDto } from '../types/item';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (!axiosError.response) {
      throw new Error('Unable to connect to the server. Please check if the backend is running.');
    }
    throw new Error(axiosError.response.data?.message || 'An error occurred while processing your request.');
  }
  throw error;
};

export const itemsApi = {
  getAll: async (): Promise<Item[]> => {
    try {
      const response = await api.get('/items');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getById: async (id: number): Promise<Item> => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  create: async (item: CreateItemDto): Promise<Item> => {
    try {
      const response = await api.post('/items', item);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  update: async (id: number, item: UpdateItemDto): Promise<Item> => {
    try {
      const response = await api.put(`/items/${id}`, item);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/items/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },
};
