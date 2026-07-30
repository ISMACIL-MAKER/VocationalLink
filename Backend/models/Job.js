import mongoose from "mongoose";
import { SOMALILAND_REGIONS, VOCATIONAL_CATEGORIES } from "../constants/enums.js";

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: VOCATIONAL_CATEGORIES,
      default: "Other",
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      enum: SOMALILAND_REGIONS,
      default: "Other",
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "apprenticeship"],
      default: "full-time",
    },
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    currency: { type: String, enum: ["USD", "SLSH"], default: "USD" },
    applicationDeadline: { type: Date },
    matchScore: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "pending_payment", "active", "closed", "expired"],
      default: "active",
    },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    views: { type: Number, default: 0 },
    applicantCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

jobSchema.index({ region: 1, category: 1, status: 1 });
jobSchema.index({ title: "text", description: "text", company: "text" });

export default mongoose.model("Job", jobSchema);
