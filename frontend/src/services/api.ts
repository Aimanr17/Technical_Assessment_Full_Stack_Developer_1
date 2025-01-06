import axios, { AxiosError } from 'axios';
import { CreateItemDto, Item, UpdateItemDto } from '../types/item';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorMessage = axiosError.response?.data?.message || 
                        axiosError.response?.data?.error || 
                        'An error occurred while processing your request.';
    throw new Error(errorMessage);
  }
  throw error;
};

export const itemsApi = {
  getAll: async (): Promise<Item[]> => {
    try {
      const response = await api.get<Item[]>('/items');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  getById: async (id: number): Promise<Item> => {
    try {
      const response = await api.get<Item>(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  create: async (item: CreateItemDto): Promise<Item> => {
    try {
      const response = await api.post<Item>('/items', item);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  update: async (id: number, item: UpdateItemDto): Promise<Item> => {
    try {
      const response = await api.put<Item>(`/items/${id}`, item);
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
  }
};

export const testApi = {
  healthCheck: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  
  dbTest: async () => {
    try {
      const response = await api.get('/db-test');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  }
};