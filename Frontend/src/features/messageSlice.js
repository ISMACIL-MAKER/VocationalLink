import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosClient from "../api/axiosClient";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (applicationId, thunkAPI) => {
    try {
      const { data } = await axiosClient.get(`/messages/${applicationId}`);
      return { applicationId, messages: data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load messages.",
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ applicationId, text }, thunkAPI) => {
    try {
      const { data } = await axiosClient.post(`/messages/${applicationId}`, { text });
      return { applicationId, message: data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send message.",
      );
    }
  },
);

const initialState = {
  byApplication: {},
  loading: false,
  sending: false,
  error: null,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.byApplication[action.payload.applicationId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const { applicationId, message } = action.payload;
        if (!state.byApplication[applicationId]) {
          state.byApplication[applicationId] = [];
        }
        state.byApplication[applicationId].push(message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        toast.error(action.payload || "Failed to send message.");
      });
  },
});

export default messageSlice.reducer;
