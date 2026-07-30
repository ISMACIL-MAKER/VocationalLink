import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    readAt: { type: Date },
  },
  { timestamps: true },
);

messageSchema.index({ applicationId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
