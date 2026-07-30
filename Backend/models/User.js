import mongoose from "mongoose";
import { SOMALILAND_REGIONS, VOCATIONAL_CATEGORIES } from "../constants/enums.js";

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true, default: "" },
    fileUrl: { type: String, required: true },
    fileName: { type: String, default: "" },
    issuedAt: { type: Date },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verificationNote: { type: String, default: "" },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
  },
  { timestamps: true },
);

const skillSchema = new mongoose.Schema({
  category: { type: String, enum: VOCATIONAL_CATEGORIES, required: true },
  skillName: { type: String, required: true, trim: true },
  proficiency: {
    type: String,
    enum: ["beginner", "intermediate", "expert"],
    default: "beginner",
  },
  yearsExperience: { type: Number, min: 0, default: 0 },
  certificates: [certificateSchema],
});

const employerProfileSchema = new mongoose.Schema(
  {
    companyName: { type: String, trim: true, default: "" },
    companyLogo: { type: String, default: "" },
    companyDescription: { type: String, default: "" },
    region: { type: String, enum: SOMALILAND_REGIONS, default: "Hargeisa" },
    registrationStatus: {
      type: String,
      enum: ["not_submitted", "pending", "approved", "rejected"],
      default: "not_submitted",
    },
    registrationDocuments: [{ type: String }],
    registrationNote: { type: String, default: "" },
    subscriptionTier: { type: String, enum: ["free", "basic", "premium"], default: "free" },
    subscriptionStatus: { type: String, enum: ["none", "active", "expired"], default: "none" },
    subscriptionExpiresAt: { type: Date },
  },
  { _id: false },
);

const seekerProfileSchema = new mongoose.Schema(
  {
    region: { type: String, enum: SOMALILAND_REGIONS, default: "Hargeisa" },
    availability: {
      type: String,
      enum: ["available", "employed", "not_looking"],
      default: "available",
    },
    experienceYears: { type: Number, min: 0, default: 0 },
    targetJobTitles: { type: [String], default: [] },
    skills: [skillSchema],
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, trim: true, default: "" },
    role: {
      type: String,
      enum: ["Job-Seeker", "Employer", "Super-Admin"],
      default: "Job-Seeker",
    },
    preferredLanguage: { type: String, enum: ["so", "en"], default: "so" },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    skills: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    cvName: {
      type: String,
      default: "",
    },
    cvFile: {
      type: String,
      default: "",
    },
    hiddenJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    seekerProfile: { type: seekerProfileSchema, default: () => ({}) },
    employerProfile: { type: employerProfileSchema, default: () => ({}) },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 });
userSchema.index({ "seekerProfile.region": 1, "seekerProfile.skills.category": 1 });
userSchema.index({ "employerProfile.registrationStatus": 1 });

export default mongoose.model("User", userSchema);
