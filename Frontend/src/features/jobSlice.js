import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/Jop/recentJop");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load jobs.",
      );
    }
  },
);

export const hideJob = createAsyncThunk(
  "jobs/hideJob",
  async ({ jobId }, thunkAPI) => {
    try {
      const { data } = await axiosClient.post(`/Jop/${jobId}/hide`);
      return { jobId, hiddenJobs: data.hiddenJobs };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to hide job.",
      );
    }
  },
);

export const searchPublicJobs = createAsyncThunk(
  "jobs/searchPublicJobs",
  async (params, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/jobs/search", { params });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to search jobs.",
      );
    }
  },
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (jobId, thunkAPI) => {
    try {
      const { data } = await axiosClient.get(`/jobs/${jobId}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load job.",
      );
    }
  },
);

export const fetchFeaturedJobs = createAsyncThunk(
  "jobs/fetchFeaturedJobs",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/jobs/search", {
        params: { limit: 6 },
      });
      return data.jobs;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load featured jobs.",
      );
    }
  },
);

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  publicJobs: [],
  publicPagination: { page: 1, limit: 9, total: 0, totalPages: 1 },
  publicLoading: false,
  publicError: null,
  currentJob: null,
  currentJobLoading: false,
  currentJobError: null,
  featuredJobs: [],
  featuredLoading: false,
  featuredError: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(hideJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.payload.jobId);
      })
      .addCase(hideJob.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(searchPublicJobs.pending, (state) => {
        state.publicLoading = true;
        state.publicError = null;
      })
      .addCase(searchPublicJobs.fulfilled, (state, action) => {
        state.publicLoading = false;
        state.publicJobs = action.payload.jobs;
        state.publicPagination = action.payload.pagination;
      })
      .addCase(searchPublicJobs.rejected, (state, action) => {
        state.publicLoading = false;
        state.publicError = action.payload;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.currentJobLoading = true;
        state.currentJobError = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.currentJobLoading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.currentJobLoading = false;
        state.currentJobError = action.payload;
      })
      .addCase(fetchFeaturedJobs.pending, (state) => {
        state.featuredLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedJobs.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredJobs = action.payload;
      })
      .addCase(fetchFeaturedJobs.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError = action.payload;
      });
  },
});

export const { clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
