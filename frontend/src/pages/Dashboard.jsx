import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/contexts-Files/authContext";
import axios from "axios";
import {
    FiTrendingUp,
    FiActivity,
    FiCpu,
    FiDollarSign,
    FiCode,
    FiBookOpen,
    FiCheckCircle,
    FiMap,
    FiClock,
    FiArrowRight
} from "react-icons/fi";

function Dashboard() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCalls: 0,
        tokensUsed: 0,
        costSaved: 0,
        activeTools: 0,
        daysActive: 0,
        tokensPerDay: 0
    });

    const [toolUsage, setToolUsage] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [dailyTokens, setDailyTokens] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!token) return;

            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/analytics`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    const data = res.data.analytics;

                    // Process stats
                    setStats({
                        totalCalls: data.totalCalls,
                        tokensUsed: data.tokensUsed,
                        costSaved: (data.tokensUsed / 1000 * 0.002).toFixed(2), // Rough estimate
                        activeTools: data.toolUsage.length,
                        daysActive: data.daysActive,
                        tokensPerDay: data.tokensPerDay
                    });

                    // Process tool usage with colors
                    const toolColors = {
                        "Learn": "bg-green-600",
                        "Review": "bg-green-700",
                        "Explain": "bg-green-500",
                        "Roadmap": "bg-green-800",
                        "Formatter": "bg-green-400",
                        "Debugger": "bg-green-900"
                    };

                    setToolUsage(data.toolUsage.map(t => ({
                        ...t,
                        color: toolColors[t.name] || "bg-green-600"
                    })));

                    // Process weekly data (ensure all days are present or just show available)
                    // Transforming YYYY-MM-DD to Day name
                    const processedWeekly = data.messagesByDay.map(d => {
                        const date = new Date(d._id);
                        return {
                            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                            value: d.count
                        };
                    });

                    // Fill in missing days if needed or just use what we have. 
                    // For now, let's use what we have but maybe ensure at least some dummy structure if empty?
                    // Actually, if empty, the chart will just be empty.
                    setWeeklyData(processedWeekly.length > 0 ? processedWeekly : [
                        { day: "Mon", value: 0 }, { day: "Tue", value: 0 }, { day: "Wed", value: 0 },
                        { day: "Thu", value: 0 }, { day: "Fri", value: 0 }, { day: "Sat", value: 0 },
                        { day: "Sun", value: 0 }
                    ]);

                    // For daily tokens, we'll use the same distribution relative to messages for now
                    // since we don't track exact tokens per message in backend yet
                    const processedTokens = data.messagesByDay.map(d => {
                        const date = new Date(d._id);
                        return {
                            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                            tokens: d.count * 100 // Estimate
                        };
                    });

                    setDailyTokens(processedTokens.length > 0 ? processedTokens : [
                        { day: "Mon", tokens: 0 }, { day: "Tue", tokens: 0 }, { day: "Wed", tokens: 0 },
                        { day: "Thu", tokens: 0 }, { day: "Fri", tokens: 0 }, { day: "Sat", tokens: 0 },
                        { day: "Sun", tokens: 0 }
                    ]);

                    // Process recent activity
                    setRecentActivity(data.recentActivity.map(session => ({
                        action: `Used ${session.page} tool: ${session.title}`,
                        time: new Date(session.lastUpdated).toLocaleDateString(),
                        icon: getIconForTool(session.page)
                    })));
                }
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [token]);

    const getIconForTool = (tool) => {
        switch (tool) {
            case 'learn': return <FiBookOpen />;
            case 'review': return <FiCheckCircle />;
            case 'explain': return <FiCode />;
            case 'roadmap': return <FiMap />;
            default: return <FiActivity />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-green-600"></div>
            </div>
        );
    }

    const maxValue = Math.max(...weeklyData.map(d => d.value));
    const maxTokens = Math.max(...dailyTokens.map(d => d.tokens));

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/30 to-white px-4 py-10">
            <div className="max-w-7xl mx-auto mt-16">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Track your AI usage and productivity insights</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {/* Total API Calls */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FiActivity className="text-green-700 text-xl" />
                            </div>
                            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                +12%
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total API Calls</h3>
                        <p className="text-3xl font-bold text-gray-800">{stats.totalCalls.toLocaleString()}</p>
                    </div>

                    {/* Tokens Used */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FiCpu className="text-green-700 text-xl" />
                            </div>
                            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                +8%
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Tokens Consumed</h3>
                        <p className="text-3xl font-bold text-gray-800">{stats.tokensUsed.toLocaleString()}</p>
                    </div>

                    {/* Cost Saved */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FiDollarSign className="text-green-700 text-xl" />
                            </div>
                            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                +15%
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Cost Efficiency</h3>
                        <p className="text-3xl font-bold text-gray-800">${stats.costSaved}</p>
                    </div>

                    {/* Active Tools */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FiTrendingUp className="text-green-700 text-xl" />
                            </div>
                            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                Active
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Active Tools</h3>
                        <p className="text-3xl font-bold text-gray-800">{stats.activeTools}</p>
                    </div>

                    {/* Tokens Per Day */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FiActivity className="text-green-700 text-xl" />
                            </div>
                            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                                Avg
                            </span>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Tokens / Day</h3>
                        <p className="text-3xl font-bold text-gray-800">{stats.tokensPerDay.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Charts */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Weekly Usage Chart */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Weekly AI Usage</h3>
                                <span className="text-sm text-gray-600">Last 7 days</span>
                            </div>

                            <div className="flex items-end justify-start h-72 gap-6 px-4">
                                {weeklyData.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center gap-3 h-full max-w-[60px]">
                                        <div className="w-full flex-1 flex items-end justify-center relative">
                                            <div
                                                className="w-12 bg-gradient-to-t from-green-700 to-green-600 rounded-t-lg transition-all duration-500 hover:from-green-800 hover:to-green-700 relative group cursor-pointer shadow-sm"
                                                style={{ height: `${(data.value / maxValue) * 100}%`, minHeight: '30px' }}
                                            >
                                                <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 whitespace-nowrap">
                                                    {data.value}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">{data.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Daily Tokens Chart */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Daily Token Consumption</h3>
                                <span className="text-sm text-gray-600">Last 7 days</span>
                            </div>

                            <div className="flex items-end justify-start h-72 gap-6 px-4">
                                {dailyTokens.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center gap-3 h-full max-w-[60px]">
                                        <div className="w-full flex-1 flex items-end justify-center relative">
                                            <div
                                                className="w-12 bg-gradient-to-t from-green-600 to-green-500 rounded-t-lg transition-all duration-500 hover:from-green-700 hover:to-green-600 relative group cursor-pointer shadow-sm"
                                                style={{ height: `${(data.tokens / maxTokens) * 100}%`, minHeight: '30px' }}
                                            >
                                                <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 whitespace-nowrap">
                                                    {data.tokens}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">{data.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tool Usage Breakdown */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Tool Usage Breakdown</h3>

                            <div className="space-y-5">
                                {toolUsage.map((tool, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
                                                <span className="font-semibold text-gray-800">{tool.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">{tool.count} calls</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-full ${tool.color} rounded-full transition-all duration-500`}
                                                style={{ width: `${tool.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Activity & Actions */}
                    <div className="space-y-6">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>

                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-700 flex-shrink-0">
                                            {activity.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{activity.action}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <FiClock className="text-xs" />
                                                {activity.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-xl p-6 text-white shadow-lg">
                            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>

                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/tools')}
                                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all flex items-center justify-between group"
                                >
                                    <span className="font-medium">Explore Tools</span>
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all flex items-center justify-between group"
                                >
                                    <span className="font-medium">Upgrade Plan</span>
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all flex items-center justify-between group"
                                >
                                    <span className="font-medium">View Profile</span>
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Usage Summary */}
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Usage Overview</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Total API Calls</span>
                                    <span className="font-bold text-gray-800">{stats.totalCalls.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Avg. Calls / Day</span>
                                    <span className="font-bold text-gray-800">
                                        {Math.round(stats.totalCalls / (stats.daysActive || 1))}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Peak Usage Day</span>
                                    <span className="font-bold text-gray-800">
                                        {weeklyData.reduce((max, d) => d.value > max.value ? d : max, weeklyData[0] || { day: '-' }).day}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <span className="text-sm font-semibold text-green-700">Messages Today</span>
                                    <span className="font-bold text-green-700">
                                        {weeklyData[weeklyData.length - 1]?.value || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
