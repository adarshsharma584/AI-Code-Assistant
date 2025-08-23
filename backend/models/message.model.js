import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "ai"]

    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

// Index to improve query performance when fetching messages by chatSession
messageSchema.index({ chatSession: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);