import exprees from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();
const app = exprees();

app.use(exprees.json());

app.get("/teste", (req, res) => {
  res.json("hellow");
});

app.post("/api/User/register", async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    if (!username && !password && !email && !role) {
      res.status(401).json({ message: "buxui dhaman " });
    }

    const UserCreate = await User.create({
      username,
      password,
      email:email.toLowerCase(),
      role,
    });
  } catch (error) {
    res.status(400).json({message: error.message});

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
