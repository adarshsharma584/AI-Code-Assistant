import { ChatSession } from "../models/chatSession.model.js";
import { Message } from "../models/message.model.js";

export async function getUserAnalytics(req, res) {
    try {
        const userId = req.user.id;

        // Get total sessions count
        const totalSessions = await ChatSession.countDocuments({ user: userId });

        // Get sessions by tool/page
        const sessionsByTool = await ChatSession.aggregate([
            { $match: { user: userId } },
            { $group: { _id: "$page", count: { $sum: 1 } } }
        ]);

        // Get total messages (API calls)
        const userSessions = await ChatSession.find({ user: userId }).select('_id');
        const sessionIds = userSessions.map(s => s._id);

        const totalMessages = await Message.countDocuments({
            chatSession: { $in: sessionIds },
            role: "user" // Count only user messages as API calls
        });

        // Get messages by day for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const messagesByDay = await Message.aggregate([
            {
                $match: {
                    chatSession: { $in: sessionIds },
                    role: "user",
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get recent activity
        const recentSessions = await ChatSession.find({ user: userId })
            .sort({ lastUpdated: -1 })
            .limit(5)
            .select('title page lastUpdated');

        // Calculate estimated tokens (rough estimate: avg 100 tokens per message)
        const estimatedTokens = totalMessages * 100;
        const daysActive = Math.max(1, Math.ceil((Date.now() - sevenDaysAgo) / (1000 * 60 * 60 * 24)));
        const tokensPerDay = Math.round(estimatedTokens / daysActive);

        // Format tool usage data
        const toolUsage = sessionsByTool.map(tool => ({
            name: tool._id.charAt(0).toUpperCase() + tool._id.slice(1),
            count: tool.count,
            percentage: Math.round((tool.count / totalSessions) * 100)
        }));

        return res.status(200).json({
            success: true,
            analytics: {
                totalCalls: totalMessages,
                totalSessions,
                tokensUsed: estimatedTokens,
                tokensPerDay,
                daysActive,
                toolUsage,
                messagesByDay,
                recentActivity: recentSessions
            }
        });
    } catch (error) {
        console.error("Get user analytics error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics"
        });
    }
}
