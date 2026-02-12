import { User } from "../models/user.model.js";
import { getUserAnalytics } from "./analytics.controller.js";

export async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.user.id).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user });
    } catch (e) {
        console.error("Get current user error:", e);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { getUserAnalytics };
