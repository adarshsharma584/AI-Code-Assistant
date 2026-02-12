import { User } from "../models/user.model.js";

const TOKEN_LIMITS = {
    free: 20000, // Increased for testing
    pro: 50000,
    enterprise: 1000000
};

export async function checkTokenLimit(req, res, next) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if limit should reset (if last reset was not today)
        const now = new Date();
        const lastReset = new Date(user.lastTokenReset);

        if (now.toDateString() !== lastReset.toDateString()) {
            user.dailyTokenUsage = 0;
            user.lastTokenReset = now;
            await user.save();
        }

        const limit = TOKEN_LIMITS[user.plan] || TOKEN_LIMITS.free;

        if (user.dailyTokenUsage >= limit) {
            return res.status(429).json({
                success: false,
                message: "Daily token limit exceeded. Upgrade to Pro for more tokens!",
                limitExceeded: true
            });
        }

        req.userModel = user; // Pass user model to next middleware/controller
        next();
    } catch (error) {
        console.error("Token limit check error:", error);
        return res.status(500).json({ success: false, message: "Error checking token limits" });
    }
}
