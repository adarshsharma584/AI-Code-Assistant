import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiPlus, FiClock, FiTrash2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
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

function Explain() {
  const [code, setCode] = useState("// Paste code here");
  const [language, setLanguage] = useState("javascript");
  const [markdown, setMarkdown] = useState(
    "## Explanation\nYour explanation will appear here"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.style.height = "auto";
      codeRef.current.style.height = `${codeRef.current.scrollHeight}px`;
    }
  }, [code]);

  useEffect(() => {
    api.get("/chats/page/explain").then((res) => {
      setChatHistory(res.data.chatSessions || []);
    });
  }, []);

  const startNewSession = async () => {
    try {
      const res = await api.post("/chats?page=explain", {
        title: "Code Explanation",
      });
      setCurrentSessionId(res.data.chatSession._id);
      setMarkdown("## Explanation\nYour explanation will appear here");
      setCode("// Paste code here");
      const historyRes = await api.get("/chats/page/explain");
      setChatHistory(historyRes.data.chatSessions || []);
      toast.success("New session started");
    } catch {
      toast.error("Failed to start session");
    }
  };

  const generateExplanation = async () => {
    if (!code.trim()) return toast.warning("Paste some code first");
    setIsLoading(true);
    try {
      const res = await api.post("/prompt/explain-code", {
        code,
        language,
        chatSessionId: currentSessionId,
      });
      setMarkdown(
        res.data.data?.explanation ||
          res.data.data?.messages?.[1]?.content ||
          ""
      );
      setCurrentSessionId(
        res.data.data?.sessionId ||
          res.data.data?.chatSessionId ||
          currentSessionId
      );
      const historyRes = await api.get("/chats/page/explain");
      setChatHistory(historyRes.data.chatSessions || []);
    } catch {
      toast.error("Failed to generate explanation");
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

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this session?")) return;
    await api.delete(`/chats/${id}`);
    setChatHistory((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="h-full mt-16 bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="bg-white border-b px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Code Explainer</h1>
        <div className="flex gap-2">
          <button
            onClick={startNewSession}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FiPlus /> New
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            <FiClock /> History
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* HISTORY SIDEBAR */}
        {showHistory && (
          <aside className="w-72 bg-white text-gray-700 border-r overflow-y-auto">
            {chatHistory.map((chat) => (
              <div
                key={chat._id}
                onClick={() => loadChat(chat)}
                className={`p-4 cursor-pointer border-b hover:bg-gray-100  ${
                  currentSessionId === chat._id && "bg-blue-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-700">
                    {chat.title}
                  </p>
                  <FiTrash2
                    onClick={(e) => deleteChat(chat._id, e)}
                    className="text-gray-700 hover:text-red-500"
                  />
                </div>
                <p className="text-xs text-gray-700 mt-1">
                  {new Date(chat.updatedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </aside>
        )}

        {/* MAIN PANELS */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-[1000px]">
          {/* CODE INPUT */}
          <div className= "relative bg-black text-white  border-r p-5 space-y-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border bg-white text-gray-700 rounded-md px-3 py-2"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="go">Go</option>
            </select>

            <textarea
              ref={codeRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full  h-[865px] border rounded-md px-3 py-2 resize-none font-mono text-sm"
              rows={41}
            />

            <button
              onClick={generateExplanation}
              disabled={isLoading}
              className=" absolute right-4  bottom-4 w-[20%] bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              {isLoading ? "Explaining…" : "Explain Code"}
            </button>
          </div>

          {/* OUTPUT */}
          <div className="bg-black text-white p-6 overflow-auto">
            <div className="prose max-w-3xl mx-auto">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explain;
