import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Jop from "./models/Jop.js";
import Application from "./models/Application.js";
import Notification from "./models/Notification.js";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();

app.use(express.json({ limit: "5mb" }));
app.use(cors());

const transporter =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

const sendEmailIfConfigured = async ({ to, subject, text }) => {
  if (!transporter || !to) return;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.log("Email send failed:", error.message);
  }
};

app.get("/teste", (req, res) => {
  res.json("hellow");
});
// auth login and register
app.post("/api/User/register", async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    if (!username || !password || !email || !role) {
      return res.status(400).json({ message: "Fadlan buxuxi dhaman " });
    }

    const existe = await User.findOne({ email: email.toLowerCase() });
    if (existe) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const NewUser = await User.create({
      username,
      password: hashedpassword,
      email: email.toLowerCase(),
      role,
    });

    return res.status(201).json({
      message: "wala diwangaleye",
      user: {
        id: NewUser._id,
        username: NewUser.username,
        email: NewUser.email,
        role: NewUser.role,
        skills: NewUser.skills,
        profileImage: NewUser.profileImage,
        bio: NewUser.bio,
        cvName: NewUser.cvName,
        cvFile: NewUser.cvFile,
        hiddenJobs: NewUser.hiddenJobs || [],
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/User/Login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Fadlan geli email iyo password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "lama hayo emailkan" });
    }

    const ismaching = await bcrypt.compare(password, user.password);
    if (!ismaching) {
      return res.status(400).json({ message: "password and email ma jero" });
    }

    const Token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "Login succesful",
      Token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        skills: user.skills || [],
        profileImage: user.profileImage || "",
        bio: user.bio || "",
        cvName: user.cvName || "",
        cvFile: user.cvFile || "",
        hiddenJobs: user.hiddenJobs || [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while logging in.",
      error: error.message,
    });
  }
});

app.get("/api/User/:id", async (req, res) => {
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

app.put("/api/User/:id/profile", async (req, res) => {
  try {
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
      user: {
        id: updated._id,
        username: updated.username,
        email: updated.email,
        role: updated.role,
        skills: updated.skills || [],
        profileImage: updated.profileImage || "",
        bio: updated.bio || "",
        cvName: updated.cvName || "",
        cvFile: updated.cvFile || "",
        hiddenJobs: updated.hiddenJobs || [],
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
//Jop post

app.post("/api/Jop/ADDJOP", async (req, res) => {
  try {
    const { title, company, matchScore, location, Description, employerId } =
      req.body;
    if (!title || !company || !matchScore) {
      res.status(400).json({ message: "xogta buxi " });
    }
    if (!employerId) {
      return res.status(400).json({ message: "Employer ID is required." });
    }
    const NewJop = await Jop.create({
      employerId,
      title,
      company,
      matchScore,
      location,
      Description,
    });

    res.status(200).json({
      message: "wala diwan galeyey",
      NewJop: {
        id: req.id,
        title: NewJop.title,
        matchScore: NewJop.matchScore,
        location: NewJop.location,
        Description: NewJop.Description,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//get jop
app.get("/api/Jop/recentJop", async (req, res) => {
  try {
    const AllJop = await Jop.find().sort({ createdAt: -1 });
    res.status(200).json(AllJop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/Jop/:jobId", async (req, res) => {
  try {
    const { requesterId, role } = req.body;
    if (!requesterId || !role) {
      return res.status(400).json({ message: "Requester info is required." });
    }

    const job = await Jop.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const ownerId = String(job.employerId || job.id || "");
    const isEmployerOwner =
      role === "Employer" && ownerId && ownerId === String(requesterId);
    if (!isEmployerOwner) {
      return res
        .status(403)
        .json({ message: "Only the employer owner can delete this job." });
    }

    await Application.deleteMany({ jobId: job._id });
    await Jop.findByIdAndDelete(job._id);

    return res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/api/Jop/:jobId/hide", async (req, res) => {
  try {
    const { seekerId, role } = req.body;
    if (!seekerId || role !== "Job-Seeker") {
      return res.status(403).json({ message: "Only seeker can hide jobs." });
    }

    const job = await Jop.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      seekerId,
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

app.post("/api/Application/apply", async (req, res) => {
  try {
    const { jobId, seekerId, seekerName, seekerEmail } = req.body;

    if (!jobId || !seekerId || !seekerName || !seekerEmail) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const job = await Jop.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
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

app.get("/api/Application/seeker/:seekerId", async (req, res) => {
  try {
    const applications = await Application.find({ seekerId: req.params.seekerId })
      .populate("jobId")
      .sort({ createdAt: -1 });
    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/api/Application/employer/:employerId", async (req, res) => {
  try {
    const applications = await Application.find({
      employerId: req.params.employerId,
    })
      .populate("jobId")
      .sort({ createdAt: -1 });
    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/api/Application/:applicationId/status", async (req, res) => {
  try {
    const { employerId, status } = req.body;
    if (!employerId || !status) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const allowedStatus = ["pending", "reviewed", "accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const application = await Application.findById(req.params.applicationId).populate(
      "jobId",
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (String(application.employerId) !== String(employerId)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this application." });
    }

    application.status = status;
    await application.save();

    await Notification.create({
      userId: application.seekerId,
      title: "Application Status Updated",
      message: `Your application for "${application?.jobId?.title || "job"}" is now ${status}.`,
    });

    await sendEmailIfConfigured({
      to: application.seekerEmail,
      subject: "Application status updated",
      text: `Your application for "${application?.jobId?.title || "job"}" is now ${status}.`,
    });

    return res.status(200).json({
      message: "Application status updated.",
      application,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/api/Notification/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/api/Notification/:notificationId/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { read: true },
      { new: true },
    );
    if (!updated) {
      return res.status(404).json({ message: "Notification not found." });
    }
    return res.status(200).json(updated);
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
