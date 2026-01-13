import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { Bid, BidsState, CreateBidData, BidsResponse } from '../../types';

const initialState: BidsState = {
  bids: [],
  myBids: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Create bid
export const createBid = createAsyncThunk<Bid, CreateBidData, { rejectValue: string }>(
  'bids/create',
  async (bidData, thunkAPI) => {
    try {
      const response = await api.post<{ success: boolean; bid: Bid }>('/bids', bidData);
      return response.data.bid;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get bids for gig
export const getBidsForGig = createAsyncThunk<Bid[], string, { rejectValue: string }>(
  'bids/getForGig',
  async (gigId, thunkAPI) => {
    try {
      const response = await api.get<BidsResponse>(`/bids/${gigId}`);
      return response.data.bids;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get my bids
export const getMyBids = createAsyncThunk<Bid[], void, { rejectValue: string }>(
  'bids/getMy',
  async (_, thunkAPI) => {
    try {
      const response = await api.get<BidsResponse>('/bids/my/submitted');
      return response.data.bids;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Hire bid
export const hireBid = createAsyncThunk<Bid, string, { rejectValue: string }>(
  'bids/hire',
  async (bidId, thunkAPI) => {
    try {
      const response = await api.patch<{ success: boolean; bid: Bid }>(`/bids/${bidId}/hire`);
      return response.data.bid;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update bid
export const updateBid = createAsyncThunk<Bid, { id: string; data: Partial<CreateBidData> }, { rejectValue: string }>(
  'bids/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await api.put<{ success: boolean; bid: Bid }>(`/bids/${id}`, data);
      return response.data.bid;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete bid
export const deleteBid = createAsyncThunk<string, string, { rejectValue: string }>(
  'bids/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/bids/${id}`);
      return id;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearBids: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Create bid
      .addCase(createBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBid.fulfilled, (state, action: PayloadAction<Bid>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myBids.unshift(action.payload);
      })
      .addCase(createBid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to create bid';
      })
      // Get bids for gig
      .addCase(getBidsForGig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBidsForGig.fulfilled, (state, action: PayloadAction<Bid[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bids = action.payload;
      })
      .addCase(getBidsForGig.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch bids';
      })
      // Get my bids
      .addCase(getMyBids.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyBids.fulfilled, (state, action: PayloadAction<Bid[]>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.myBids = action.payload;
      })
      .addCase(getMyBids.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch your bids';
      })
      // Hire bid
      .addCase(hireBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(hireBid.fulfilled, (state, action: PayloadAction<Bid>) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.bids.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.bids[index] = action.payload;
        }
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to hire freelancer';
      })
      // Update bid
      .addCase(updateBid.fulfilled, (state, action: PayloadAction<Bid>) => {
        state.isSuccess = true;
        const index = state.myBids.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.myBids[index] = action.payload;
        }
      })
      // Delete bid
      .addCase(deleteBid.fulfilled, (state, action: PayloadAction<string>) => {
        state.isSuccess = true;
        state.myBids = state.myBids.filter((b) => b._id !== action.payload);
      });
  },
});

export const { reset ,clearBids} = bidsSlice.actions;
export default bidsSlice.reducer;