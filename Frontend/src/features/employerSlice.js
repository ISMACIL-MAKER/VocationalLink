import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosClient from "../api/axiosClient";
import { submitJobPayment } from "./paymentSlice";

export const updateEmployerProfile = createAsyncThunk(
  "employer/updateEmployerProfile",
  async (updates, thunkAPI) => {
    try {
      const { data } = await axiosClient.put("/employer/profile", updates);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update company profile.",
      );
    }
  },
);

export const fetchEmployerJobs = createAsyncThunk(
  "employer/fetchEmployerJobs",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/employer/jobs");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load your jobs.",
      );
    }
  },
);

export const createEmployerJob = createAsyncThunk(
  "employer/createEmployerJob",
  async (jobData, thunkAPI) => {
    try {
      const { data } = await axiosClient.post("/employer/jobs", jobData);
      return data.job;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to post job.",
      );
    }
  },
);

export const deleteEmployerJob = createAsyncThunk(
  "employer/deleteEmployerJob",
  async (jobId, thunkAPI) => {
    try {
      await axiosClient.delete(`/employer/jobs/${jobId}`);
      return jobId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete job.",
      );
    }
  },
);

export const fetchEmployerApplications = createAsyncThunk(
  "employer/fetchEmployerApplications",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/employer/applications");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load applicants.",
      );
    }
  },
);

export const updateApplicationStage = createAsyncThunk(
  "employer/updateApplicationStage",
  async ({ applicationId, ...updates }, thunkAPI) => {
    try {
      const { data } = await axiosClient.put(
        `/employer/applications/${applicationId}/stage`,
        updates,
      );
      return data.application;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update candidate stage.",
      );
    }
  },
);

export const searchTalent = createAsyncThunk(
  "employer/searchTalent",
  async (params, thunkAPI) => {
    try {
      const { data } = await axiosClient.get("/employer/talent-search", { params });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to search talent.",
      );
    }
  },
);

export const inviteCandidate = createAsyncThunk(
  "employer/inviteCandidate",
  async ({ candidateId, jobId }, thunkAPI) => {
    try {
      const { data } = await axiosClient.post("/employer/invite", { candidateId, jobId });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send invitation.",
      );
    }
  },
);

const initialState = {
  jobs: [],
  jobsLoading: false,
  jobsError: null,
  applications: [],
  applicationsLoading: false,
  applicationsError: null,
  talentResults: [],
  talentPagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
  talentLoading: false,
  talentError: null,
};

const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerJobs.pending, (state) => {
        state.jobsLoading = true;
        state.jobsError = null;
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => {
        state.jobsLoading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => {
        state.jobsLoading = false;
        state.jobsError = action.payload;
      })
      .addCase(createEmployerJob.pending, (state) => {
        state.jobsLoading = true;
      })
      .addCase(createEmployerJob.fulfilled, (state, action) => {
        state.jobsLoading = false;
        state.jobs.unshift(action.payload);
        toast.success("Job posted! Submit payment to activate it.");
      })
      .addCase(createEmployerJob.rejected, (state, action) => {
        state.jobsLoading = false;
        toast.error(action.payload || "Failed to post job.");
      })
      .addCase(deleteEmployerJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
        toast.success("Job deleted.");
      })
      .addCase(deleteEmployerJob.rejected, (state, action) => {
        toast.error(action.payload || "Failed to delete job.");
      })
      .addCase(submitJobPayment.fulfilled, (state, action) => {
        state.jobs = state.jobs.map((job) =>
          job._id === action.payload.job._id ? action.payload.job : job,
        );
      })
      .addCase(fetchEmployerApplications.pending, (state) => {
        state.applicationsLoading = true;
        state.applicationsError = null;
      })
      .addCase(fetchEmployerApplications.fulfilled, (state, action) => {
        state.applicationsLoading = false;
        state.applications = action.payload;
      })
      .addCase(fetchEmployerApplications.rejected, (state, action) => {
        state.applicationsLoading = false;
        state.applicationsError = action.payload;
      })
      .addCase(updateApplicationStage.fulfilled, (state, action) => {
        state.applications = state.applications.map((app) =>
          app._id === action.payload._id ? action.payload : app,
        );
        toast.success("Candidate updated.");
      })
      .addCase(updateApplicationStage.rejected, (state, action) => {
        toast.error(action.payload || "Failed to update candidate.");
      })
      .addCase(searchTalent.pending, (state) => {
        state.talentLoading = true;
        state.talentError = null;
      })
      .addCase(searchTalent.fulfilled, (state, action) => {
        state.talentLoading = false;
        state.talentResults = action.payload.candidates;
        state.talentPagination = action.payload.pagination;
      })
      .addCase(searchTalent.rejected, (state, action) => {
        state.talentLoading = false;
        state.talentError = action.payload;
      })
      .addCase(inviteCandidate.fulfilled, () => {
        toast.success("Invitation sent to candidate.");
      })
      .addCase(inviteCandidate.rejected, (state, action) => {
        toast.error(action.payload || "Failed to send invitation.");
      });
  },
});

export default employerSlice.reducer;
