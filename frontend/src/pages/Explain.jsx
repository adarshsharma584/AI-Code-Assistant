import { FiSend, FiPlus, FiClock, FiTrash2, FiSidebar, FiLayout, FiCode, FiTerminal } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react"
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

function Explain() {
  const [code, setCode] = useState("// Paste code here");
  const [language, setLanguage] = useState("javascript");
  const [markdown, setMarkdown] = useState(
    "## Explanation\nYour explanation will appear here"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const codeRef = useRef(null);

  const currentChat = chatHistory.find((c) => c._id === currentSessionId);
  const title = currentChat?.title || "Decipher Complex Logic";

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
    // Keep sidebar open like ChatGPT
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this session?")) return;
    await api.delete(`/chats/${id}`);
    setChatHistory((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="flex h-[calc(100vh-96px)] w-full bg-transparent overflow-hidden relative group/sidebar">
      {/* Sidebar - Premium Glass Aesthetic */}
      <aside className={`${showHistory ? 'w-[300px]' : 'w-0'} bg-white/60 backdrop-blur-xl border-r border-white/20 flex flex-col transition-all duration-[400ms] relative z-40 overflow-hidden shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)]`}>
        <div className="p-5 flex flex-col h-full min-w-[300px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <FiLayout className="text-blue-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Explain
              </span>
            </h2>
            <button
              onClick={() => setShowHistory(false)}
              className="p-2 hover:bg-white/50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              title="Close sidebar"
            >
              <FiSidebar size={18} />
            </button>
          </div>

          <button
            onClick={startNewSession}
            className="flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all duration-300 active:scale-95 shadow-lg shadow-slate-900/20 mb-6 group/btn"
          >
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shadow-inner group-hover/btn:scale-110 transition-transform">
              <FiPlus size={18} />
            </div>
            <span className="font-bold text-sm tracking-wide">New Session</span>
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <h3 className="text-[10px] font-black text-slate-400/80 uppercase tracking-[0.2em] mb-4 pl-2">History</h3>
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => loadChat(chat)}
                  className={`group p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 border ${currentSessionId === chat._id
                    ? "bg-white shadow-md border-blue-100/50 ring-1 ring-blue-500/10"
                    : "bg-transparent border-transparent hover:bg-white/40 hover:border-white/40"
                    }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${currentSessionId === chat._id ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-300'}`} />
                  <p className={`flex-1 text-sm font-semibold line-clamp-1 leading-snug ${currentSessionId === chat._id ? "text-slate-800" : "text-slate-500"}`}>
                    {chat.title || "Untitled Explanation"}
                  </p>
                  <button
                    onClick={(e) => deleteChat(chat._id, e)}
                    className={`p-1.5 hover:bg-red-50 rounded-lg transition-all ${currentSessionId === chat._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  >
                    <FiTrash2 className="text-slate-300 hover:text-red-500" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Interface - Transparent for Mesh Background */}
      <main className="flex-1 flex flex-col bg-transparent relative overflow-hidden">
        {/* Toggle Sidebar Button */}
        {!showHistory && (
          <button
            onClick={() => setShowHistory(true)}
            className="absolute top-1/2 -left-3 z-50 p-3 bg-white/80 backdrop-blur-md border border-white/50 shadow-xl rounded-full text-slate-400 hover:text-blue-600 transition-all hover:scale-110 active:scale-95 -translate-y-1/2 group/toggle"
            title="Open Sidebar"
          >
            <FiSidebar size={18} className="rotate-180 group-hover/toggle:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Minimal Floating Top Header */}
        <div className="absolute top-6 left-0 right-0 h-10 pointer-events-none flex items-center justify-center z-30">
          <div className="pointer-events-auto glass-card px-5 py-2 rounded-full flex items-center gap-3 shadow-lg shadow-slate-200/20">
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase bg-slate-50/50 px-2 py-1 rounded-md border border-slate-100">Explain</span>
            <div className="w-px h-3 bg-slate-200" />
            <span className="text-xs font-bold text-slate-700">{title}</span>
          </div>
        </div>

        {/* Content Area with Glass Code Studio */}
        <section className="flex-1 relative overflow-hidden flex flex-col p-4 pt-20 pb-24">
          <div className="flex-1 relative border border-white/30 rounded-[2.5rem] overflow-hidden glass-card flex flex-col md:flex-row shadow-2xl shadow-slate-200/20 ring-1 ring-white/50">
            {/* Input Panel - Code Editor Style */}
            <div className="md:w-1/2 flex flex-col border-r border-slate-200/50 bg-white/30 backdrop-blur-md cursor-text" onClick={() => codeRef.current?.focus()}>
              <div className="px-6 py-3 border-b border-slate-200/50 bg-white/40 flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/60 border border-slate-200/50 rounded-lg shadow-sm">
                  <FiCode className="text-blue-500" size={14} />
                  <span className="text-[11px] font-bold text-slate-600 tracking-wide font-mono">explain_this.js</span>
                </div>
              </div>
              <textarea
                ref={codeRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 w-full p-8 text-sm font-mono text-slate-800 bg-transparent resize-none outline-none custom-scrollbar leading-relaxed"
                placeholder="// Paste code to understand..."
                spellCheck="false"
              />
            </div>

            {/* Output Panel - AI Analysis */}
            <div className="md:w-1/2 flex flex-col bg-slate-50/30 backdrop-blur-md relative border-l border-white/20">
              <div className="px-6 py-4 border-b border-white/30 bg-white/40 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FiTerminal className="text-slate-400" size={14} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Explanation</span>
                </div>
              </div>
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar text-slate-800 bg-white/20">
                <div className="prose prose-slate max-w-none
                  prose-headings:text-slate-900
                  prose-headings:font-black
                  prose-p:text-slate-600
                  prose-p:leading-relaxed
                  prose-li:text-slate-600
                  prose-strong:text-slate-900
                  prose-code:text-indigo-600
                  prose-code:bg-white/50
                  prose-code:px-1
                  prose-code:rounded
                  prose-pre:bg-slate-900
                  prose-pre:shadow-lg
                  prose-pre:border
                  prose-pre:border-slate-800">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Deciphering...</h3>
                    </div>
                  ) : (
                    <ReactMarkdown>
                      {markdown}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Bottom Control Bar */}
        <section className="absolute bottom-8 left-0 right-0 z-30 flex justify-center px-4">
          <div className="max-w-2xl w-full">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative flex items-center gap-3 glass-panel p-2 pl-4 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:border-white/60 transition-all ring-1 ring-white/40">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white/50 border-none rounded-full px-4 py-2 text-xs font-bold text-slate-700 focus:ring-1 focus:ring-blue-500/20 outline-none cursor-pointer transition-all hover:bg-white/80"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="go">Go</option>
                </select>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-auto mr-4">Ready?</span>
                <button
                  onClick={generateExplanation}
                  disabled={isLoading || !code.trim()}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-slate-800 transition active:scale-95 disabled:opacity-20 shadow-lg shadow-slate-900/20"
                >
                  {isLoading ? "Explaining..." : "Explain"} <FiSend />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

export default Explain;
