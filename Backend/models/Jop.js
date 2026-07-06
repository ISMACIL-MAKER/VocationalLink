import mongoose from "mongoose";

const Jopschema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    company: {
      type: String,
      require: true,
    },
    matchScore: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      require: true,
    },
    Description: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);
export default mongoose.model("Jop", Jopschema);
