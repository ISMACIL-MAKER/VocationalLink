import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosClient from "../api/axiosClient";
import {
  updateSeekerProfile,
  addOrUpdateSkill,
  deleteSkill,
  uploadCertificate,
  deleteCertificate,
} from "./seekerSlice";
import { updateEmployerProfile } from "./employerSlice";

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const persistSession = (accessToken, user) => {
  localStorage.setItem("token", accessToken);
  localStorage.setItem("user", JSON.stringify(user));
};

const persistUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const { data } = await axiosClient.post("/auth/register", userData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed.",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await axiosClient.post("/auth/login", credentials);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed.",
      );
    }
  },
);

export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrapAuth",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosClient.post("/auth/refresh");
      return data;
    } catch {
      return thunkAPI.rejectWithValue(null);
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await axiosClient.post("/auth/logout");
  } catch {
    // Session is cleared client-side regardless of server response.
  }
});

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ userId, updates }, thunkAPI) => {
    try {
      const { data } = await axiosClient.put(`/User/${userId}/profile`, updates);
      return data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update profile.",
      );
    }
  },
);

const initialState = {
  user: readStoredUser(),
  token: localStorage.getItem("token") || null,
  loading: false,
  bootstrapped: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        persistSession(action.payload.accessToken, action.payload.user);
        toast.success(`Welcome to VocationalLink, ${action.payload.user.username}!`);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Registration failed.");
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        persistSession(action.payload.accessToken, action.payload.user);
        toast.success(`Welcome back, ${action.payload.user.username}!`);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Login failed.");
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.bootstrapped = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        persistSession(action.payload.accessToken, action.payload.user);
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.bootstrapped = true;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Signed out.");
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        persistUser(action.payload);
        toast.success("Profile updated successfully.");
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload || "Failed to update profile.");
      })
      // Keep the "current user" single source of truth in sync whenever the
      // seeker slice mutates portfolio data (skills/certificates/profile),
      // since the verification badge and every dashboard read from auth.user.
      .addCase(updateSeekerProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        persistUser(action.payload);
      })
      .addCase(addOrUpdateSkill.fulfilled, (state, action) => {
        state.user = action.payload;
        persistUser(action.payload);
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.user = action.payload;
        persistUser(action.payload);
      })
      .addCase(uploadCertificate.fulfilled, (state, action) => {
        state.user = action.payload;
        persistUser(action.payload);
      })
      .addCase(deleteCertificate.fulfilled, (state, action) => {
        state.user = action.payload;
        persistUser(action.payload);
      })
      .addCase(updateEmployerProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        persistUser(action.payload);
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
