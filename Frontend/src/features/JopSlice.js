import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// 1. SAX: Waxaa lagu daray createAsyncThunk oo ka maqnaa
export const fetchJobs = createAsyncThunk("JOP/getJop", async (_, thunkApi) => {
  // Parameter-ka koowaad waa 'arg' (haddii xog la soo dirayo), kan labaad waa thunkApi
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
      });
  },
});

export default JopSlice.reducer;
