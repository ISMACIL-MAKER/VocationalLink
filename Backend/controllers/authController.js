import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import {
  REFRESH_COOKIE_NAME,
  generateAccessToken,
  generateRefreshToken,
  refreshCookieOptions,
} from "../utils/tokens.js";

const issueSession = (res, user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
  return accessToken;
};

export const register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    if (!username || !password || !email || !role) {
      return res.status(400).json({ message: "Fadlan buuxi dhammaan xogta." });
    }
    if (!["Job-Seeker", "Employer"].includes(role)) {
      return res.status(400).json({ message: "Invalid account type selected." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email: email.toLowerCase(),
      role,
    });

    const accessToken = issueSession(res, newUser);

    return res.status(201).json({
      message: "Account created successfully.",
      accessToken,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Fadlan geli email iyo password." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Email ama password khaldan." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email ama password khaldan." });
    }

    if (user.status === "suspended") {
      return res.status(403).json({ message: "Your account has been suspended." });
    }

    const accessToken = issueSession(res, user);

    return res.status(200).json({
      message: "Login successful.",
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({ user: sanitizeUser(req.user) });
};

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      return res
        .status(401)
        .json({ message: "Session expired. Please log in again." });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.status === "suspended") {
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      return res.status(401).json({ message: "Account no longer available." });
    }

    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (_req, res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
  return res.status(200).json({ message: "Logged out successfully." });
};
