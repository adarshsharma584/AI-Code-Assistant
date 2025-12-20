import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/dbConnection.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import promptRoutes from "./routes/prompt.route.js";
import reviewRoutes from "./routes/review.route.js";
import roadmapRoutes from "./routes/roadmap.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration - allow frontend URL
const allowedOrigins = [
  "https://coddydev.vercel.app", // Production frontend
  process.env.CORS_ORIGIN, // From environment variable if set
  "http://localhost:5173", // Local development
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // For production, you might want to restrict this
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

await connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Hello, World!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/prompt", promptRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/roadmap", roadmapRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
