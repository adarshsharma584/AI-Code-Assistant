import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    page: {
      type: String,
      required: true,
      enum: ["learn", "review", "explain", "roadmap"],
      default: "learn",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Update lastUpdated timestamp when messages are added or modified
chatSessionSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

export const ChatSession = mongoose.model("ChatSession", chatSessionSchema);