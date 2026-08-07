import jwt from "jsonwebtoken";

export const REFRESH_COOKIE_NAME = "refreshToken";

export const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });

export const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  });

export const refreshCookieOptions = {
  httpOnly: true,
  secure: true,        // Waa muhiim si Cross-Site Cookies ay ugu shaqeeyaan HTTPS (Render)
  sameSite: "none",    // WAA MUHIIM! Si Vercel iyo Render ay Cookie-ga u wadaagaan
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};