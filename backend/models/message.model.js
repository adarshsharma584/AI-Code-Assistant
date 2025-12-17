import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatSession: { type: mongoose.Schema.Types.ObjectId, ref: "ChatSession", required: true },
    role: { type: String, enum: ["user", "ai", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
