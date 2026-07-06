import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Jop from "./models/Jop.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

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
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while logging in.",
      error: error.message,
    });
  }
});
//Jop post

app.post("/api/Jop/ADDJOP", async (req, res) => {
  try {
    const { title, company, matchScore, location, Description } = req.body;
    if (!title || !company || !matchScore) {
      res.status(400).json({ message: "xogta buxi " });
    }
    const NewJop = await Jop.create({
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
    const AllJop = await Jop.find({ id: req.id }).sort({ createdAt: -1 });
    res.status(200).json(AllJop);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
