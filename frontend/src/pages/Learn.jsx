import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiSend, FiClock, FiTrash2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "https://ai-code-assistant-one.vercel.app/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

function Learn() {
  const [title, setTitle] = useState("Learning Notes");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [markdown, setMarkdown] = useState(
    "## Learning Material\nYour notes will appear here"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [topic]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/chats/page/learn");
        setChatHistory(res.data.chatSessions || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchHistory();
  }, []);

  const startNewSession = async () => {
    try {
      const res = await api.post("/chats?page=learn", { title });
      setCurrentSessionId(res.data.chatSession._id);
      setMarkdown("## Learning Material\nYour notes will appear here");
      setTopic("");
      const historyRes = await api.get("/chats/page/learn");
      setChatHistory(historyRes.data.chatSessions || []);
      toast.success("New learning session started");
    } catch (e) {
      console.error(e);
      toast.error("Failed to start session");
    }
  };

  const generateNotes = async () => {
    if (!topic.trim()) {
      toast.warning("Please enter a topic");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post("/prompt/learning-material", {
        title,
        topic,
        level,
        chatSessionId: currentSessionId,
      });
      setMarkdown(
        res.data.data?.material?.content || res.data.data?.material || ""
      );
      setCurrentSessionId(
        res.data.data?.sessionId ||
          res.data.data?.chatSessionId ||
          currentSessionId
      );
      setTopic("");
      const historyRes = await api.get("/chats/page/learn");
      setChatHistory(historyRes.data.chatSessions || []);
      toast.success("Notes generated");
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.message || "Failed to generate notes";
      toast.error(msg);
      setMarkdown(`## Error\n${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = async (chat) => {
    try {
      const res = await api.get(`/chats/${chat._id}`);
      const messages = res.data.chatSession.messages || [];
      const aiMsg = messages.find((m) => m.role !== "user");
      if (aiMsg) setMarkdown(aiMsg.content);
      setCurrentSessionId(chat._id);
      setShowHistory(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load session");
    }
  };

  const deleteChat = async (chatId) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await api.delete(`/chats/${chatId}`);
      setChatHistory((prev) => prev.filter((c) => c._id !== chatId));
      if (currentSessionId === chatId) {
        setMarkdown("## Learning Material\nYour notes will appear here");
        setCurrentSessionId(null);
      }
      toast.success("Session deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
          Learning Notes
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={startNewSession}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-all shadow-lg"
          >
            <FiPlus className="mr-2" /> New Session
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center px-5 py-2.5 rounded-lg ${
              showHistory
                ? "bg-gray-700 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <FiClock className="mr-2" /> History
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {showHistory && (
          <div className="w-72 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
              <h2 className="font-semibold text-lg text-gray-200">Sessions</h2>
              <p className="text-xs text-gray-400 mt-1">
                Your previous learning sessions
              </p>
            </div>
            <div className="divide-y divide-gray-700">
              {chatHistory.map((chat) => (
                <div
                  key={chat._id}
                  className={`p-4 hover:bg-gray-700/50 cursor-pointer group relative ${
                    currentSessionId === chat._id
                      ? "bg-gray-700/70 border-l-4 border-indigo-400"
                      : "border-l-4 border-transparent"
                  }`}
                  onClick={() => loadChat(chat)}
                >
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-gray-200 line-clamp-2 pr-5 font-medium">
                      {chat.title}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1.5 rounded-full hover:bg-gray-600"
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(
                      chat.updatedAt || chat.createdAt
                    ).toLocaleString()}
                  </div>
                </div>
              ))}
              {chatHistory.length === 0 && (
                <div className="p-8 text-center">
                  <div className="bg-gray-800/50 rounded-xl p-6 max-w-xs mx-auto">
                    <p className="text-gray-400 text-sm">No sessions yet</p>
                    <button
                      onClick={startNewSession}
                      className="mt-4 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                    >
                      New Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-r border-gray-700 bg-gray-900">
            <div className="p-4 border-b border-gray-700 bg-gray-800/50">
              <h2 className="font-semibold text-xl text-gray-200">Input</h2>
            </div>
            <div className="p-4 space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-gray-800 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                ref={textareaRef}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic (e.g., JavaScript Promises)"
                className="w-full bg-gray-800 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={3}
              />
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-gray-800 text-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <div className="flex justify-end">
                <button
                  onClick={generateNotes}
                  disabled={isLoading}
                  className="flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading ? (
                    "Generating…"
                  ) : (
                    <>
                      <span>Generate Notes</span>
                      <FiSend className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-gray-900">
            <div className="p-4 border-b border-gray-700 bg-gray-800/50">
              <h2 className="font-semibold text-xl text-gray-200">Notes</h2>
            </div>
            <div className="flex-1 overflow-auto px-6 bg-gray-900">
              <div className="prose prose-invert max-w-4xl mx-auto px-4">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {markdown}
                </ReactMarkdown>
              </div>
              {isLoading && (
                <div className="flex items-center justify-center h-40 text-gray-400">
                  Generating…
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Learn;
