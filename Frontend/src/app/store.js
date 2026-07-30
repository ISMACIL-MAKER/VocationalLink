import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import jobReducer from "../features/jobSlice";
import applicationReducer from "../features/applicationSlice";
import notificationReducer from "../features/notificationSlice";
import statsReducer from "../features/statsSlice";
import seekerReducer from "../features/seekerSlice";
import employerReducer from "../features/employerSlice";
import paymentReducer from "../features/paymentSlice";
import messageReducer from "../features/messageSlice";
import adminReducer from "../features/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    notifications: notificationReducer,
    stats: statsReducer,
    seeker: seekerReducer,
    employer: employerReducer,
    payment: paymentReducer,
    messages: messageReducer,
    admin: adminReducer,
  },
});
