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
      .addCase(applyForJob.pending, (state) => {
        state.applyLoading = true; // Waxaa loo beddelay applyLoading si uusan shaashadda dhan u loading gareyn
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.applyLoading = false;

        // SAX: Halkan state.jobs looma taabanayo si aan nidaamku u crash-garoobin.
        // Haddii aad rabto inaad shaqada la codsaday calaamad u yeesho, waxaad update gareyn kartaa array-ga:
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload.jobId,
        );
        if (index !== -1) {
          // Tusaale: Waxaad ku dari kartaa boolean si aad u ogaato in hore loo codsaday
          state.jobs[index].hasApplied = true;
        }
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.applyLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default JopSlice.reducer;
