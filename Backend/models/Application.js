import mongoose from "mongoose";

const feedbackNoteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seekerName: {
      type: String,
      required: true,
    },
    seekerEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "shortlisted",
        "interview_scheduled",
        "hired",
        "rejected",
      ],
      default: "pending",
    },
    statusHistory: [statusHistorySchema],
    feedbackNotes: [feedbackNoteSchema],
    interview: {
      scheduledAt: { type: Date },
      mode: { type: String, enum: ["in-person", "phone", "video"], default: "in-person" },
      location: { type: String, default: "" },
    },
  },
  { timestamps: true },
);

applicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

applicationSchema.pre("save", function () {
  if (this.isNew || this.isModified("status")) {
    this.statusHistory.push({ status: this.status });
  }
});

export default mongoose.model("Application", applicationSchema);
