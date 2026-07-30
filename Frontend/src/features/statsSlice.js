import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchPublicStats = createAsyncThunk(
  "stats/fetchPublicStats",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/stats/public");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load stats.",
      );
    }
  },
);

const initialState = {
  totalActiveJobs: 0,
  totalEmployers: 0,
  totalSeekers: 0,
  verifiedEmployers: 0,
  verifiedSeekers: 0,
  totalHires: 0,
  categoryCounts: [],
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicStats.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchPublicStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default statsSlice.reducer;
