import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosClient from "../api/axiosClient";

export const submitJobPayment = createAsyncThunk(
  "payment/submitJobPayment",
  async ({ jobId, ...paymentData }, thunkAPI) => {
    try {
      const { data } = await axiosClient.post(
        `/employer/jobs/${jobId}/payment`,
        paymentData,
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to submit payment.",
      );
    }
  },
);

const initialState = {
  submitting: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitJobPayment.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitJobPayment.fulfilled, (state, action) => {
        state.submitting = false;
        toast.success(
          action.payload.message || "Payment submitted for verification.",
        );
      })
      .addCase(submitJobPayment.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to submit payment.");
      });
  },
});

export default paymentSlice.reducer;
