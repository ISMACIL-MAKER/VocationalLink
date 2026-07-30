import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosClient from "../api/axiosClient";

export const fetchPendingVerifications = createAsyncThunk(
  "admin/fetchPendingVerifications",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/admin/verifications");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load pending verifications.",
      );
    }
  },
);

export const decideVerification = createAsyncThunk(
  "admin/decideVerification",
  async (payload, thunkAPI) => {
    try {
      const { data } = await axiosClient.put("/admin/verifications", payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to record decision.",
      );
    }
  },
);

export const fetchPendingPayments = createAsyncThunk(
  "admin/fetchPendingPayments",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/admin/payments");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load pending payments.",
      );
    }
  },
);

export const decidePayment = createAsyncThunk(
  "admin/decidePayment",
  async (payload, thunkAPI) => {
    try {
      const { data } = await axiosClient.put("/admin/payments", payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to record decision.",
      );
    }
  },
);

export const fetchPendingEmployers = createAsyncThunk(
  "admin/fetchPendingEmployers",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/admin/employers");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load pending employers.",
      );
    }
  },
);

export const decideEmployer = createAsyncThunk(
  "admin/decideEmployer",
  async (payload, thunkAPI) => {
    try {
      const { data } = await axiosClient.put("/admin/employers", payload);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to record decision.",
      );
    }
  },
);

export const fetchAdminAnalytics = createAsyncThunk(
  "admin/fetchAdminAnalytics",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/admin/analytics");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load analytics.",
      );
    }
  },
);

const initialState = {
  verifications: [],
  verificationsLoading: false,
  verificationsError: null,
  payments: [],
  paymentsLoading: false,
  paymentsError: null,
  employers: [],
  employersLoading: false,
  employersError: null,
  analytics: {
    userBreakdown: { seekers: 0, employers: 0, admins: 0 },
    totalActiveJobs: 0,
    pendingApprovals: { verifications: 0, payments: 0, employers: 0, total: 0 },
    regionBreakdown: [],
    topSkills: [],
    revenue: [],
    recentAuditLogs: [],
  },
  analyticsLoading: false,
  analyticsError: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingVerifications.pending, (state) => {
        state.verificationsLoading = true;
        state.verificationsError = null;
      })
      .addCase(fetchPendingVerifications.fulfilled, (state, action) => {
        state.verificationsLoading = false;
        state.verifications = action.payload;
      })
      .addCase(fetchPendingVerifications.rejected, (state, action) => {
        state.verificationsLoading = false;
        state.verificationsError = action.payload;
      })
      .addCase(decideVerification.fulfilled, (state, action) => {
        const { certificateId } = action.meta.arg;
        state.verifications = state.verifications.filter(
          (item) => item.certificateId !== certificateId,
        );
        toast.success(action.payload.message);
      })
      .addCase(decideVerification.rejected, (state, action) => {
        toast.error(action.payload || "Failed to record decision.");
      })
      .addCase(fetchPendingPayments.pending, (state) => {
        state.paymentsLoading = true;
        state.paymentsError = null;
      })
      .addCase(fetchPendingPayments.fulfilled, (state, action) => {
        state.paymentsLoading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPendingPayments.rejected, (state, action) => {
        state.paymentsLoading = false;
        state.paymentsError = action.payload;
      })
      .addCase(decidePayment.fulfilled, (state, action) => {
        const { paymentId } = action.meta.arg;
        state.payments = state.payments.filter((item) => item._id !== paymentId);
        toast.success(action.payload.message);
      })
      .addCase(decidePayment.rejected, (state, action) => {
        toast.error(action.payload || "Failed to record decision.");
      })
      .addCase(fetchPendingEmployers.pending, (state) => {
        state.employersLoading = true;
        state.employersError = null;
      })
      .addCase(fetchPendingEmployers.fulfilled, (state, action) => {
        state.employersLoading = false;
        state.employers = action.payload;
      })
      .addCase(fetchPendingEmployers.rejected, (state, action) => {
        state.employersLoading = false;
        state.employersError = action.payload;
      })
      .addCase(decideEmployer.fulfilled, (state, action) => {
        const { userId } = action.meta.arg;
        state.employers = state.employers.filter((item) => item._id !== userId);
        toast.success(action.payload.message);
      })
      .addCase(decideEmployer.rejected, (state, action) => {
        toast.error(action.payload || "Failed to record decision.");
      })
      .addCase(fetchAdminAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(fetchAdminAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAdminAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload;
      });
  },
});

export default adminSlice.reducer;
