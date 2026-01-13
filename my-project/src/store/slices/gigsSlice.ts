import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { Gig, GigsState, CreateGigData, GigQueryParams, PaginatedGigsResponse } from '../../types';

const initialState: GigsState = {
  gigs: [],
  gig: null,
  myGigs: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  total: 0,
  currentPage: 1,
  totalPages: 1,
};

// Get all gigs
export const getGigs = createAsyncThunk<PaginatedGigsResponse, GigQueryParams, { rejectValue: string }>(
  'gigs/getAll',
  async ({ search = '', page = 1 }, thunkAPI) => {
    try {
      const response = await api.get<PaginatedGigsResponse>(`/gigs?search=${search}&page=${page}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single gig
export const getGig = createAsyncThunk<Gig, string, { rejectValue: string }>(
  'gigs/getOne',
  async (id, thunkAPI) => {
    try {
      const response = await api.get<{ success: boolean; gig: Gig }>(`/gigs/${id}`);
      return response.data.gig;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create gig
export const createGig = createAsyncThunk<Gig, CreateGigData, { rejectValue: string }>(
  'gigs/create',
  async (gigData, thunkAPI) => {
    try {
      const response = await api.post<{ success: boolean; gig: Gig }>('/gigs', gigData);
      return response.data.gig;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get my gigs
export const getMyGigs = createAsyncThunk<Gig[], void, { rejectValue: string }>(
  'gigs/getMy',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<{ success: boolean; gigs: Gig[] }>('/gigs/my/posted');
      return response.data.gigs;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update gig
export const updateGig = createAsyncThunk<Gig, { id: string; data: Partial<CreateGigData> }, { rejectValue: string }>(
  'gigs/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put<{ success: boolean; gig: Gig }>(`/gigs/${id}`, data);
      return response.data.gig;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete gig
export const deleteGig = createAsyncThunk<string, string, { rejectValue: string }>(
  'gigs/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/gigs/${id}`);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const gigsSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all gigs
      .addCase(getGigs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGigs.fulfilled, (state, action: PayloadAction<PaginatedGigsResponse>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gigs = action.payload.gigs;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch gigs';
      })
      // Get single gig
      .addCase(getGig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getGig.fulfilled, (state, action: PayloadAction<Gig>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gig = action.payload;
      })
      .addCase(getGig.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch gig';
      })
      // Create gig
      .addCase(createGig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGig.fulfilled, (state, action: PayloadAction<Gig>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.gigs.unshift(action.payload);
      })
      .addCase(createGig.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to create gig';
      })
      // Get my gigs
      .addCase(getMyGigs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyGigs.fulfilled, (state, action: PayloadAction<Gig[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myGigs = action.payload;
      })
      .addCase(getMyGigs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch your gigs';
      })
      // Update gig
      .addCase(updateGig.fulfilled, (state, action: PayloadAction<Gig>) => {
        state.isSuccess = true;
        const index = state.gigs.findIndex((g) => g._id === action.payload._id);
        if (index !== -1) {
          state.gigs[index] = action.payload;
        }
      })
      // Delete gig
      .addCase(deleteGig.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSuccess = true;
        state.gigs = state.gigs.filter((g) => g._id !== action.payload);
        state.myGigs = state.myGigs.filter((g) => g._id !== action.payload);
      });
  },
});

export const { reset } = gigsSlice.actions;
export default gigsSlice.reducer;