import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Item, CreateItemDto, UpdateItemDto } from '../types/item';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:3001/api'; // Updated to match backend port

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Item[]>(`${API_URL}/items`);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Network Error');
      return rejectWithValue(error.response?.data?.message || 'Network Error');
    }
  }
);

export const createItem = createAsyncThunk(
  'items/createItem',
  async (data: CreateItemDto, { rejectWithValue }) => {
    try {
      const response = await axios.post<Item>(`${API_URL}/items`, data);
      toast.success('Item created successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create item');
      return rejectWithValue(error.response?.data?.message || 'Failed to create item');
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, data }: { id: number; data: UpdateItemDto }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Item>(`${API_URL}/items/${id}`, data);
      toast.success('Item updated successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update item');
      return rejectWithValue(error.response?.data?.message || 'Failed to update item');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/items/${id}`);
      toast.success('Item deleted successfully');
      return id;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete item');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete item');
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch items';
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.error = null;
      });
  },
});

export default itemsSlice.reducer;
