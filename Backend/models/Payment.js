import mongoose from "mongoose";
import { PAYMENT_METHODS, SUBSCRIPTION_TIERS } from "../constants/enums.js";

const paymentSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    purpose: {
      type: String,
      enum: ["job_posting", "subscription"],
      required: true,
    },
    subscriptionTier: { type: String, enum: SUBSCRIPTION_TIERS },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ["USD", "SLSH"], default: "USD" },
    method: { type: String, enum: PAYMENT_METHODS, required: true },
    payerPhone: { type: String, required: true, trim: true },
    transactionRef: { type: String, required: true, trim: true },
    receiptImage: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: { type: Date },
    reviewNote: { type: String, default: "" },
  },
  { timestamps: true },
);

paymentSchema.index({ employerId: 1, status: 1 });

export default mongoose.model("Payment", paymentSchema);
