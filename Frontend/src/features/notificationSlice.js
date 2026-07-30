import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axiosClient.get(`/Notification/${userId}`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load notifications.",
      );
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (notificationId, thunkAPI) => {
    try {
      const { data } = await axiosClient.put(`/Notification/${notificationId}/read`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update notification.",
      );
    }
  },
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.items = state.items.map((notification) =>
          notification._id === action.payload._id ? action.payload : notification,
        );
      });
  },
});

export default notificationSlice.reducer;
