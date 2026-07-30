import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosClient from "../api/axiosClient";

export const updateSeekerProfile = createAsyncThunk(
  "seeker/updateSeekerProfile",
  async (updates, thunkAPI) => {
    try {
      const { data } = await axiosClient.put("/seeker/profile", updates);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile.",
      );
    }
  },
);

export const addOrUpdateSkill = createAsyncThunk(
  "seeker/addOrUpdateSkill",
  async (skillData, thunkAPI) => {
    try {
      const { data } = await axiosClient.put("/seeker/skills", skillData);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to save skill.",
      );
    }
  },
);

export const deleteSkill = createAsyncThunk(
  "seeker/deleteSkill",
  async (skillId, thunkAPI) => {
    try {
      const { data } = await axiosClient.delete(`/seeker/skills/${skillId}`);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove skill.",
      );
    }
  },
);

export const uploadCertificate = createAsyncThunk(
  "seeker/uploadCertificate",
  async ({ skillId, certificate }, thunkAPI) => {
    try {
      const { data } = await axiosClient.post(
        `/seeker/skills/${skillId}/certificates`,
        certificate,
      );
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to upload certificate.",
      );
    }
  },
);

export const deleteCertificate = createAsyncThunk(
  "seeker/deleteCertificate",
  async ({ skillId, certificateId }, thunkAPI) => {
    try {
      const { data } = await axiosClient.delete(
        `/seeker/skills/${skillId}/certificates/${certificateId}`,
      );
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove certificate.",
      );
    }
  },
);

const initialState = {
  loading: false,
  error: null,
};

const seekerSlice = createSlice({
  name: "seeker",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateSeekerProfile.fulfilled, () => {
        toast.success("Profile updated successfully.");
      })
      .addCase(addOrUpdateSkill.fulfilled, () => {
        toast.success("Skill saved to your portfolio.");
      })
      .addCase(deleteSkill.fulfilled, () => {
        toast.success("Skill removed.");
      })
      .addCase(uploadCertificate.fulfilled, () => {
        toast.success("Certificate submitted for verification.");
      })
      .addCase(deleteCertificate.fulfilled, () => {
        toast.success("Certificate removed.");
      })
      .addMatcher(
        (action) => action.type.startsWith("seeker/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith("seeker/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith("seeker/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          toast.error(action.payload || "Something went wrong.");
        },
      );
  },
});

export default seekerSlice.reducer;
