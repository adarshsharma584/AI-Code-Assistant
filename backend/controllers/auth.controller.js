import { User } from "../models/user.model.js";

function setTokens(res, accessToken, refreshToken) {
  const secure = false;
  res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax", secure, maxAge: 1000 * 60 * 60 });
  res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "lax", secure, maxAge: 1000 * 60 * 60 * 24 * 7 });
}

export async function register(req, res) {
  try {
    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password) return res.status(400).json({ success: false, message: "All fields are required" });
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(409).json({ success: false, message: "User already exists" });
    const user = await User.create({ fullName, username, email, password });
    const { accessToken, refreshToken } = user.generateTokens();
    setTokens(res, accessToken, refreshToken);
    return res.status(201).json({ success: true, user: { id: user._id, fullName, username, email }, accessToken });
  } catch (e) {
    console.error("Registration error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ success: false, message: "Invalid credentials" });
    const { accessToken, refreshToken } = user.generateTokens();
    setTokens(res, accessToken, refreshToken);
    return res.status(200).json({ success: true, user: { id: user._id, fullName: user.fullName, username: user.username, email }, accessToken });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function logout(req, res) {
  try {
    // Clear the refresh token from the user in database
    const user = await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.clearCookie("refreshToken");

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (e) {
    console.error("Logout error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
