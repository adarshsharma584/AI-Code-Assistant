import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.accessToken;

    if (!token) return res.status(401).json({ success: false, message: "unauthorized" });

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { id: payload.id, username: payload.username, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "unauthorized" });
  }
}
