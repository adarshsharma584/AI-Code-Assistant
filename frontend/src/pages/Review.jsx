import React, { useState, useRef, useEffect } from "react";
import { FiPlus, FiClock, FiSend, FiTrash2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "https://ai-code-assistant-one.vercel.app/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function Review() {
  const [code, setCode] = useState("// Write your code here...");
  const [markdown, setMarkdown] = useState(
    "## Code Review\nYour reviewed code will appear here"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const codeEditorRef = useRef(null);

  useEffect(() => {
    api
      .get("/review/sessions")
      .then((res) => setChatHistory(res.data.reviewSessions || []))
      .catch(() => toast.error("Failed to load history"));
  }, []);

  const handleReview = async () => {
    if (!code.trim()) return toast.warning("Enter some code first");
    setIsLoading(true);
    try {
      const res = await api.post("/review/submit", {
        sessionId: currentSessionId,
        code,
      });
      setMarkdown(res.data.review);
      setCurrentSessionId(res.data.sessionId);
      const history = await api.get("/review/sessions");
      setChatHistory(history.data.reviewSessions || []);
    } catch {
      toast.error("Review failed");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async () => {
    const res = await api.post("/review/sessions", { title: "New Review" });
    setCurrentSessionId(res.data.reviewSession._id);
    setCode("// Write your code here...");
    setMarkdown("## Code Review\nYour reviewed code will appear here");
  };

  const loadChat = async (chat) => {
    const res = await api.get(`/review/sessions/${chat._id}`);
    const messages = res.data.reviewSession.messages || [];
    setCode(messages.find((m) => m.role === "user")?.content || "");
    setMarkdown(messages.find((m) => m.role === "ai")?.content || "");
    setCurrentSessionId(chat._id);
    setShowHistory(false);
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this chat?")) return;
    await api.delete(`/review/sessions/${id}`);
    setChatHistory((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="h-screen mt-16 bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-16  flex items-center justify-between px-1">
        <h1 className="text-xl font-semibold text-gray-800">
          Code Review Assistant
        </h1>

        <div className="flex gap-3">
          <button
            onClick={startNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FiPlus /> New
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex bg-gray-600 text-white items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-800 transition"
          >
            <FiClock /> History
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showHistory && (
          <aside className="w-72 border-r bg-gray-50 overflow-y-auto">
            {chatHistory.map((chat) => (
              <div
                key={chat._id}
                onClick={() => loadChat(chat)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-100 ${
                  currentSessionId === chat._id && "bg-gray-100"
                }`}
              >
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-700 line-clamp-1">
                    {chat.messages?.[0]?.content || "Untitled"}
                  </p>
                  <FiTrash2
                    onClick={(e) => deleteChat(chat._id, e)}
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

        {/* Main */}
        <main className="flex-1 flex flex-col md:flex-row">
          {/* Code Editor */}
          <section className="md:w-1/2 border-r flex flex-col">
            <div className="p-4 border-b font-semibold text-gray-700">
              Your Code
            </div>

            <textarea
              ref={codeEditorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm bg-[#1e1e1e] text-gray-100 resize-none focus:outline-none"
            />

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={handleReview}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                Review <FiSend />
              </button>
            </div>
          </section>

          {/* Review Output */}
          <section className="md:w-1/2 flex flex-col">
            <div className="p-4 border-b font-semibold text-gray-700">
              Code Review
            </div>

            <div className=" bg-[#1e1e1e] text-white flex-1 overflow-y-auto p-6 prose max-w-none">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ inline, className, children }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children)}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-black text-white font-mono px-1 rounded">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Review;
