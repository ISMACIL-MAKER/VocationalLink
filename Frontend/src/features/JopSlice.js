import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// 1. SAX: Waxaa lagu daray createAsyncThunk oo ka maqnaa
export const fetchJobs = createAsyncThunk("JOP/getJop", async (_, thunkApi) => {
  try {
    const response = await fetch("http://localhost:5000/api/Jop/recentJop");

    if (!response.ok) {
      throw new Error("Xogta la soo dhaami kari waayey!");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.message);
  }
});

// features/JopSlice.js dhexdiisa ku dar:
export const createJob = createAsyncThunk(
  "JOP/createJob",
  async (jobData, thunkAPI) => {
    try {
      //  SAX: Fetch halkan dhibicda laga saaray, waxaana lagu daray Method, Headers, iyo Body
      const response = await fetch("http://localhost:5000/api/Jop/ADDJOP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Waa lagu guuldareystay in shaqada la dhajiyo.",
        );
      }

      //  SAX: Fetch xogta wuxuu ku soo celiyaa 'data' toos ah ee ma aha response.data
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const deleteJob = createAsyncThunk(
  "JOP/deleteJob",
  async ({ jobId, requesterId, role }, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:5000/api/Jop/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requesterId, role }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete job.");
      }

      return { jobId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const JopSlice = createSlice({
  name: "JOP",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload; // Xogta halkan ayay ku keydsami doontaa
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        // SAX: Haddii rejectWithValue la isticmaalo, xogtu waxay timaadaa action.payload
        state.error = action.payload || action.error.message;
      })
      // --- CREATE JOB CASES ---
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (action.payload && action.payload.job) {
          state.jobs.push(action.payload.job);
        } else {
          state.jobs.push(action.payload);
        }
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload.jobId);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default JopSlice.reducer;
