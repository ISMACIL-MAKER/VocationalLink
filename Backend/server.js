import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import User from "./models/User.js";
import Job from "./models/Job.js";
import Application from "./models/Application.js";
import Notification from "./models/Notification.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import seekerRoutes from "./routes/seekerRoutes.js";
import employerRoutes from "./routes/employerRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { protect, authorize } from "./middleware/authMiddleware.js";
import { sanitizeUser } from "./utils/sanitizeUser.js";
import { sendEmailIfConfigured } from "./utils/email.js";

dotenv.config();
const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   }),
// );
const allowedOrigins = [
  "https://vocationallink-frontend.onrender.com", // Geli URL-ka Frontend-kaaga (Xaqiiji in UUSAN lahayn / dhamaadka)
  "http://localhost:5173"                          // Frontend-ka Localhost (Xaqiiji in UUSAN lahayn / dhamaadka)
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/seeker", seekerRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);

app.get("/teste", (req, res) => {
  res.json("hellow");
});

app.get("/api/User/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


app.put("/api/User/:id/profile", protect, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile." });
    }

    const { username, bio, skills, profileImage, cvName, cvFile } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(username !== undefined ? { username } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(profileImage !== undefined ? { profileImage } : {}),
        ...(skills !== undefined ? { skills } : {}),
        ...(cvName !== undefined ? { cvName } : {}),
        ...(cvFile !== undefined ? { cvFile } : {}),
      },
      { new: true },
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: sanitizeUser(updated),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//get jop
app.get("/api/Jop/recentJop", async (req, res) => {
  try {
    const AllJop = await Job.find({ status: "active" }).sort({ createdAt: -1 });
    res.status(200).json(AllJop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/Jop/:jobId/hide", protect, authorize("Job-Seeker"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { hiddenJobs: job._id } },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Seeker not found." });
    }

    return res.status(200).json({
      message: "Job hidden for this seeker.",
      hiddenJobs: updatedUser.hiddenJobs || [],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/api/Application/apply", protect, authorize("Job-Seeker"), async (req, res) => {
  try {
    const { jobId } = req.body;
    const seekerId = req.user._id;
    const seekerName = req.user.username;
    const seekerEmail = req.user.email;

    if (!jobId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }
    if (job.status !== "active") {
      return res.status(400).json({ message: "This job is not currently accepting applications." });
    }

    // Backward compatibility: older jobs may store owner in `id` instead of `employerId`.
    const ownerId = job.employerId || job.id;
    if (!ownerId) {
      return res.status(400).json({
        message: "This job has no employer assigned. Please repost the job.",
      });
    }

    const created = await Application.create({
      jobId,
      seekerId,
      employerId: ownerId,
      seekerName,
      seekerEmail,
    });

    await Notification.create({
      userId: ownerId,
      title: "New Job Application",
      message: `${seekerName} applied for ${job.title}.`,
    });

    const employer = await User.findById(ownerId);
    await sendEmailIfConfigured({
      to: employer?.email,
      subject: "New application received",
      text: `${seekerName} (${seekerEmail}) applied for your job "${job.title}".`,
    });

    return res.status(201).json({
      message: "Application submitted successfully.",
      application: created,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "You already applied to this job." });
    }
    return res.status(500).json({ message: error.message });
  }
});

app.get("/api/Notification/:userId", protect, async (req, res) => {
  try {
    if (
      req.user.role !== "Super-Admin" &&
      String(req.user._id) !== String(req.params.userId)
    ) {
      return res.status(403).json({ message: "You cannot view another user's notifications." });
    }

    const notifications = await Notification.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/api/Notification/:notificationId/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    if (String(notification.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "You cannot update another user's notification." });
    }

    notification.read = true;
    await notification.save();

    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongoDB is connected✅");
    app.listen(PORT, () => {
      console.log(`Server is running: http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("DB Connection Error: ❌", err));
