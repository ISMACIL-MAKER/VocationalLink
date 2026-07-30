import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosClient from "../api/axiosClient";

export const applyToJob = createAsyncThunk(
  "applications/applyToJob",
  async (applicationData, thunkAPI) => {
    try {
      const { data } = await axiosClient.post("/Application/apply", applicationData);
      return data.application;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to submit application.",
      );
    }
  },
);

export const fetchSeekerApplications = createAsyncThunk(
  "applications/fetchSeekerApplications",
  async (status, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/seeker/applications", {
        params: status ? { status } : {},
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load applications.",
      );
    }
  },
);

const initialState = {
  seekerApplications: [],
  loading: false,
  error: null,
};

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearApplicationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyToJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.loading = false;
        state.seekerApplications.unshift(action.payload);
        toast.success("Application submitted successfully.");
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to submit application.");
      })
      .addCase(fetchSeekerApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeekerApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.seekerApplications = action.payload;
      })
      .addCase(fetchSeekerApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearApplicationError } = applicationSlice.actions;
export default applicationSlice.reducer;
