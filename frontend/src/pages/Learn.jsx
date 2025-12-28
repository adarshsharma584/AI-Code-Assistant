import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiSend, FiClock, FiTrash2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: `/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
    api.get("/chats/page/learn").then((res) => {
      setChatHistory(res.data.chatSessions || []);
    });
  }, []);

  const startNewSession = async () => {
    try {
      const res = await api.post("/chats?page=learn", { title });
      setCurrentSessionId(res.data.chatSession._id);
      setMarkdown("## Learning Material\nYour notes will appear here");
      setTopic("");
      const historyRes = await api.get("/chats/page/learn");
      setChatHistory(historyRes.data.chatSessions || []);
      toast.success("New session started");
    } catch {
      toast.error("Failed to start session");
    }
  };

  const generateNotes = async () => {
    if (!topic.trim()) return toast.warning("Enter a topic");
    setIsLoading(true);
    try {
      const res = await api.post("/prompt/learning-material", {
        title,
        topic,
        level,
        chatSessionId: currentSessionId,
      });
      setMarkdown(res.data.data?.material?.content || "");
      setCurrentSessionId(res.data.data?.sessionId || currentSessionId);
      setTopic("");
      const historyRes = await api.get("/chats/page/learn");
      setChatHistory(historyRes.data.chatSessions || []);
    } catch {
      toast.error("Failed to generate notes");
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = async (chat) => {
    const res = await api.get(`/chats/${chat._id}`);
    const aiMsg = res.data.chatSession.messages.find((m) => m.role !== "user");
    if (aiMsg) setMarkdown(aiMsg.content);
    setCurrentSessionId(chat._id);
    setShowHistory(false);
  };

  const deleteChat = async (id) => {
    if (!window.confirm("Delete this session?")) return;
    await api.delete(`/chats/${id}`);
    setChatHistory((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="h-full mt-16 bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="bg-white text-gray-700 border-b px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Learning Notes</h1>
        <div className="flex gap-2">
          <button
            onClick={startNewSession}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FiPlus /> New
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className=" bg-gray-700 flex items-center gap-2 px-4 py-2 border rounded-md text-white hover:bg-gray-800"
          >
            <FiClock /> History
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* HISTORY */}
        {showHistory && (
          <aside className="w-72 bg-white text-gray-700 border-r overflow-y-auto">
            <p className="text-md px-2 py-4 text-gray-700 text-bold">History</p>
            {chatHistory.map((chat) => (
              <div
                key={chat._id}
                onClick={() => loadChat(chat)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
                  currentSessionId === chat._id && "bg-blue-50"
                }`}
              >
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {chat.title}
                  </p>
                  <FiTrash2
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat._id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(chat.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </aside>
        )}

        {/* MAIN */}
        <div className="flex h-full flex-col gap-4 min-w-[80vw] max-w-[80vw]justify-center items-center mt-4 mx-auto bg-gray-700">
          {/* INPUT */}

          {/* OUTPUT */}
          <div className="bg-gray-700 min-h-[500px] w-full text-white p-6 overflow-auto">
            <div className="prose  mx-auto">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
          <div className="relative bg-gray-700 w-full text-white border-r p-5 space-y-2  pb-16">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className=" border rounded-md w-1/3 mr-4 px-3 py-2"
              placeholder="Title"
            />

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-gray-700 w-1/3 text-white  border rounded-md px-3 py-[10px]"
            >
              <option>beginner</option>
              <option>intermediate</option>
              <option>advanced</option>
            </select>
            <textarea
              ref={textareaRef}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Topic (e.g. JavaScript Closures)"
              className="w-full border rounded-md px-3 py-2 resize-none"
              rows={3}
            />

            <button
              onClick={generateNotes}
              disabled={isLoading}
              className=" absolute  bottom-2 right-2 py-2 px-4 bg-blue-600 text-white  rounded-md hover:bg-blue-700 transition"
            >
              {isLoading ? "Generating…" : "Generate Notes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Learn;
