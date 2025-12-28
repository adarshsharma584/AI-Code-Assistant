import React, { useState, useRef, useEffect } from "react";
import {
  FiPlus,
  FiClock,
  FiSend,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function Roadmap() {
  const [topic, setTopic] = useState("");
  const [markdown, setMarkdown] = useState(
    "## Roadmap\nYour roadmap will appear here"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const textareaRef = useRef(null);

  useEffect(() => {
    api
      .get("/roadmap/sessions")
      .then((res) => setChatHistory(res.data.roadmapSessions || []))
      .catch(() => toast.error("Failed to load history"));
  }, []);

  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return toast.warning("Enter a topic");

    setIsLoading(true);
    try {
      const res = await api.post("/roadmap/generate", {
        sessionId: currentSessionId,
        goal: topic,
      });

      setMarkdown(res.data.roadmap);
      setCurrentSessionId(res.data.sessionId);
      setTopic("");

      const history = await api.get("/roadmap/sessions");
      setChatHistory(history.data.roadmapSessions || []);
    } catch {
      toast.error("Failed to generate roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewRoadmap = async () => {
    const res = await api.post("/roadmap/sessions", { title: "New Roadmap" });
    setCurrentSessionId(res.data.roadmapSession._id);
    setMarkdown("## Roadmap\nYour roadmap will appear here");
    setTopic("");
  };

  const loadRoadmap = async (roadmap) => {
    const res = await api.get(`/roadmap/sessions/${roadmap._id}`);
    const messages = res.data.roadmapSession.messages || [];
    setMarkdown(messages.at(-1)?.content || "");
    setCurrentSessionId(roadmap._id);
    setShowHistory(false);
  };

  const deleteRoadmap = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this roadmap?")) return;
    await api.delete(`/roadmap/sessions/${id}`);
    setChatHistory((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="h-full mt-16 bg-white flex flex-col">
      {/* Header */}
      <header className="h-16  bg-white  px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Roadmap Generator
        </h1>

        <div className="flex gap-3">
          <button
            onClick={startNewRoadmap}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FiPlus /> New
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-gray-600 text-white flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-800 transition"
          >
            <FiClock /> History
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showHistory && (
          <aside className="w-72 bg-gray-50 text-gray-700 border-r overflow-y-auto">
            <p className="text-gray-700 mx-2 my-2 text-bold text-lg">History</p>
            {chatHistory.map((roadmap) => (
              <div
                key={roadmap._id}
                onClick={() => loadRoadmap(roadmap)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                  currentSessionId === roadmap._id && "bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700 line-clamp-1">
                    {roadmap.messages?.[0]?.content || "Untitled"}
                  </p>
                  <FiTrash2
                    onClick={(e) => deleteRoadmap(roadmap._id, e)}
                    className="text-gray-400 hover:text-red-500"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(roadmap.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </aside>
        )}

        {/* Main */}
        <main className="relative flex-1 flex flex-col">
          {/* Preview */}
          <section className="flex-1 overflow-y-auto p-6">
            <div className=" max-w-6xl mx-auto bg-gray-700 text-white border rounded-lg shadow-sm p-6 prose">
              {isLoading ? (
                <div className=" absolute  top-0 left-0 z-10 bottom-0 w-full h-full  loader"></div>
              ) : (
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({ inline, className, children }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter style={oneDark} language={match[1]}>
                          {String(children)}
                        </SyntaxHighlighter>
                      ) : (
                        <code className="bg-gray-100 px-1 rounded">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              )}

              {isLoading && (
                <p className="text-center text-gray-500 mt-6">
                  Generating roadmap...
                </p>
              )}
            </div>
          </section>

          {/* Input */}
          <section className=" relative rounded-md min-h-[500px] bg-black text-white">
            <div className="p-4 flex justify-between items-center">
              <h3 className="font-medium text-white text-md hover:text-blue-5">
                Generate Roadmap
              </h3>
              <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <FiChevronDown /> : <FiChevronUp />}
              </button>
            </div>

            {isExpanded && (
              <form
                onSubmit={handleGenerateRoadmap}
                className="p-4 max-w-5xl mx-auto absolute bottom-0 left-0 right-0 z-10 bg-black text-white flex gap-4 items-end"
              >
                <textarea
                  ref={textareaRef}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Learn React from scratch"
                  className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={3}
                />

                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={isLoading || !topic.trim()}
                    className="px-6 py-2 text-bold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    Generate
                  </button>
                </div>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Roadmap;
