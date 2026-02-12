import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiPlus, FiClock, FiTrash2, FiSidebar, FiTerminal, FiBookOpen, FiTarget, FiLayers, FiSettings, FiList, FiZap, FiCheckCircle, FiXCircle, FiHash, FiEdit3, FiLink, FiInfo, FiChevronDown, FiChevronUp, FiCopy, FiCheck } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

const SectionIcon = ({ type }) => {
  const icons = {
    concept: <FiBookOpen className="text-blue-500" />,
    need: <FiTarget className="text-purple-500" />,
    theory: <FiLayers className="text-indigo-500" />,
    how_it_works: <FiSettings className="text-slate-600" />,
    steps: <FiList className="text-emerald-500" />,
    use_cases: <FiZap className="text-amber-500" />,
    best_practices: <FiCheckCircle className="text-green-500" />,
    common_misconceptions: <FiXCircle className="text-red-500" />,
    key_terms: <FiHash className="text-blue-400" />,
    exercises: <FiEdit3 className="text-orange-500" />,
    references: <FiLink className="text-cyan-500" />,
  };
  return icons[type] || <FiBookOpen />;
};

const CodeBlock = ({ ex }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ex.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm group/code">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{ex.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase bg-white/10 px-2 py-1 rounded-lg">
            {ex.language}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-90"
            title="Copy Code"
          >
            {copied ? <FiCheck size={14} className="text-emerald-400" /> : <FiCopy size={14} />}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={ex.language || "javascript"}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "2rem",
          fontSize: "0.9rem",
          background: "#0f172a",
          lineHeight: "1.7",
        }}
        codeTagProps={{
          style: { fontFamily: "'JetBrains Mono', monospace" }
        }}
      >
        {ex.code}
      </SyntaxHighlighter>
      {ex.explanation && (
        <div className="p-6 bg-slate-50 flex items-start gap-4 border-t border-slate-100 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <FiInfo className="text-blue-500 mt-1 flex-shrink-0" size={16} />
          <div className="text-sm text-slate-600 leading-relaxed font-medium">
            <ReactMarkdown>{ex.explanation}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

const TopicCard = ({ topic }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-card rounded-[2.5rem] p-8 hover:border-blue-200/50 transition-all duration-500 group/topic relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full -mr-20 -mt-20 group-hover/topic:scale-110 transition-transform duration-700 blur-3xl" />

      <div className="flex items-start justify-between gap-8 relative z-10">
        <div className="space-y-3">
          <h4 className="text-3xl font-black text-slate-800 tracking-tight group-hover/topic:text-blue-700 transition-colors duration-300 drop-shadow-sm">
            {topic.topic_title}
          </h4>
          <div className="prose prose-sm prose-slate max-w-none prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed">
            <ReactMarkdown>{topic.simple_explanation}</ReactMarkdown>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${isExpanded ? 'bg-slate-800 text-white shadow-lg rotate-180' : 'bg-white/50 text-slate-500 hover:bg-white hover:text-blue-600 hover:scale-105'
            }`}
        >
          <FiChevronDown size={24} />
        </button>
      </div>

      <div className={`space-y-12 overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[8000px] opacity-100 mt-12' : 'max-h-0 opacity-0 mt-0'}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            The Deep Dive
          </div>
          <div className="prose prose-slate max-w-none prose-p:text-slate-700 prose-p:leading-loose prose-strong:text-slate-900 prose-code:text-blue-700 prose-code:bg-blue-50/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-semibold">
            <ReactMarkdown>{topic.deep_dive_explanation}</ReactMarkdown>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 group/box">
            <div className="flex items-center gap-2 text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em]">
              <FiTarget size={14} />
              Reasoning
            </div>
            <div className="text-sm text-slate-700 bg-emerald-50/40 p-8 rounded-[2.5rem] border border-emerald-100/50 italic leading-relaxed relative group-hover/box:bg-emerald-50/60 transition-all duration-300 shadow-sm hover:shadow-md hover:border-emerald-200/50">
              <span className="text-4xl text-emerald-300 absolute top-4 left-6 font-serif opacity-50">"</span>
              <div className="relative z-10 pl-6 pr-4">{topic.why_it_exists}</div>
            </div>
          </div>
          <div className="space-y-4 group/box">
            <div className="flex items-center gap-2 text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em]">
              <FiSettings size={14} />
              How it works
            </div>
            <div className="text-sm text-slate-700 bg-indigo-50/40 p-8 rounded-[2.5rem] border border-indigo-100/50 leading-relaxed group-hover/box:bg-indigo-50/60 transition-all duration-300 shadow-sm hover:shadow-md hover:border-indigo-200/50">
              {topic.how_it_works_internally}
            </div>
          </div>
        </div>

        {topic.code_examples?.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              Live Implementation
            </div>
            <div className="space-y-10">
              {topic.code_examples.map((ex, idx) => (
                <CodeBlock key={idx} ex={ex} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topic.best_practices?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-black text-green-600 uppercase tracking-[0.3em]">
                <FiCheckCircle size={14} />
                Best Practices
              </div>
              <div className="space-y-3">
                {topic.best_practices.map((bp, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-3xl bg-green-50/30 border border-green-100/50 group/item hover:bg-green-50/50 transition-all hover:shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 shadow-md shadow-green-500/20">
                      <FiCheckCircle size={12} />
                    </div>
                    <p className="text-sm text-slate-700 font-semibold leading-relaxed">{bp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {topic.common_mistakes?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[11px] font-black text-red-600 uppercase tracking-[0.3em]">
                <FiXCircle size={14} />
                Common Mistakes
              </div>
              <div className="space-y-3">
                {topic.common_mistakes.map((cm, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-3xl bg-red-50/30 border border-red-100/50 group/item hover:bg-red-50/50 transition-all hover:shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 shadow-md shadow-red-500/20">
                      <FiXCircle size={12} />
                    </div>
                    <p className="text-sm text-slate-700 font-semibold leading-relaxed">{cm}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const StructuredNotes = ({ data }) => {
  if (!data) return null;

  // Render for the new Doc-centric Learn Flow
  if (data.learning_flow) {
    return (
      <div className="max-w-4xl mx-auto space-y-16 pb-20">
        <div className="space-y-6">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">{data.title}</h1>
          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/20">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-70">Executive Overview</h3>
            <p className="text-lg font-medium leading-relaxed">{data.overview}</p>
          </div>
        </div>

        {data.mental_model && (
          <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <FiLayers size={120} />
            </div>
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Mental Model</h3>
            <p className="text-xl font-bold leading-relaxed relative z-10 italic">"{data.mental_model}"</p>
          </div>
        )}

        <div className="space-y-20">
          {data.learning_flow.map((stage, sIdx) => (
            <div key={sIdx} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="px-4 py-1.5 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {stage.stage}
                </div>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              <div className="grid grid-cols-1 gap-6">
                {stage.topics.map((topic, tIdx) => (
                  <TopicCard key={tIdx} topic={topic} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {(data.architecture_insight || data.references?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100">
            {data.architecture_insight && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <FiLayers className="text-blue-500" />
                  System Architecture
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{data.architecture_insight}</p>
              </div>
            )}
            {data.references?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <FiLink className="text-purple-500" />
                  Official Sources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.references.map((ref, rIdx) => (
                    <a key={rIdx} href={ref.link} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center gap-2">
                      <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">{ref.source_type}</span>
                      {ref.source_name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Fallback for previous 'section_order' schema
  if (!data || !data.section_order) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {data.title}
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed font-medium">
          {data.summary}
        </p>
      </div>

      {/* Dynamic Sections */}
      {data.section_order.map((sectionKey) => {
        const section = data[sectionKey];
        if (!section) return null;

        return (
          <div key={sectionKey} className="group/section">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm group-hover/section:scale-110 transition-transform duration-300">
                <SectionIcon type={sectionKey} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight capitalize">
                {section.heading || sectionKey.replace(/_/g, " ")}
              </h2>
            </div>

            <div className="pl-13 bg-white">
              {/* Array Content Rendering */}
              {Array.isArray(section.content) ? (
                <div className="space-y-6">
                  {sectionKey === "steps" && (
                    <div className="space-y-4">
                      {section.content.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-800 mb-1">{item.step_title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {sectionKey === "use_cases" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.content.map((item, i) => (
                        <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <FiZap size={14} className="text-amber-500" />
                            {item.use_case_title}
                          </h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{item.scenario}</p>
                          <p className="text-sm text-slate-600 leading-relaxed italic">"{item.example}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {sectionKey === "key_terms" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {section.content.map((item, i) => (
                        <div key={i} className="flex flex-col p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <code className="text-xs font-black text-blue-600 mb-1">{item.term}</code>
                          <p className="text-xs text-slate-500 leading-snug">{item.definition}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {sectionKey === "exercises" && (
                    <div className="space-y-3">
                      {section.content.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white">
                          <p className="text-sm font-semibold text-slate-700">{item.exercise}</p>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${item.difficulty === 'Beginner' ? 'bg-green-50 text-green-600' :
                            item.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                            {item.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sectionKey === "references" && (
                    <div className="flex flex-wrap gap-3">
                      {section.content.map((item, i) => (
                        <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">
                          <FiLink size={12} />
                          {item.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <ReactMarkdown>
                  {section.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

function Learn() {
  const [title, setTitle] = useState("Learning Notes");
  // Update title when topic changes if it's still the default or empty
  const [topic, setTopic] = useState("");

  useEffect(() => {
    if (title === "Learning Notes" && topic.trim().length > 0) {
      // Optional: auto-update title state for visual feedback, 
      // but we primarily use topic for the actual session title on creation
    }
  }, [topic]);
  const [level, setLevel] = useState("beginner");
  const [markdown, setMarkdown] = useState(
    "## Learning Material\nYour notes will appear here"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [parsedData, setParsedData] = useState(null);
  const textareaRef = useRef(null);

  // Effect to parse markdown content as JSON if possible
  useEffect(() => {
    const extractJSON = (str) => {
      if (!str) return null;
      if (typeof str === 'object') {
        const obj = str;
        // If it's wrapped in { content: { ... } }, unwrap it
        if (obj.content && typeof obj.content === 'object' && (obj.content.learning_flow || obj.content.section_order)) {
          return obj.content;
        }
        return obj;
      }

      try {
        // 1. Try direct parse first
        let parsed = JSON.parse(str);
        if (parsed && typeof parsed === 'object') {
          // Check if it's wrapped in { content: { ... } }
          if (parsed.content && typeof parsed.content === 'object' && (parsed.content.learning_flow || parsed.content.section_order)) {
            return parsed.content;
          }
          return parsed;
        }
      } catch (e) {
        // Continue to other methods
      }

      try {
        // 2. Try extracting from markdown code blocks (json or just generic block)
        const match = str.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
          try {
            const parsed = JSON.parse(match[1]);
            if (parsed && typeof parsed === 'object') {
              if (parsed.content && typeof parsed.content === 'object' && (parsed.content.learning_flow || parsed.content.section_order)) {
                return parsed.content;
              }
              return parsed;
            }
          } catch (e) {
            // Block content wasn't valid JSON
          }
        }

        // 3. Try finding the first '{' and last '}' to capture the JSON object
        const start = str.indexOf('{');
        const end = str.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          const jsonStr = str.substring(start, end + 1);
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed && typeof parsed === 'object') {
              if (parsed.content && typeof parsed.content === 'object' && (parsed.content.learning_flow || parsed.content.section_order)) {
                return parsed.content;
              }
              return parsed;
            }
          } catch (e) {
            // Extracted substring wasn't valid JSON
          }
        }
      } catch (e) {
        console.error("Failed to extract JSON", e);
      }
      return null;
    };

    const data = extractJSON(markdown);
    if (data && (data.section_order || data.learning_flow || data.title)) {
      setParsedData(data);
    } else {
      setParsedData(null);
    }
  }, [markdown]);

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

  const startNewSession = async (initialTopic = "") => {
    try {
      // Use the topic as the title if available, otherwise default
      const sessionTitle = initialTopic.trim() ? initialTopic.trim() : title;
      const res = await api.post("/chats?page=learn", {
        title: sessionTitle,
        firstMessage: initialTopic.trim()
      });
      setCurrentSessionId(res.data.chatSession._id);
      setMarkdown("## Learning Material\nYour notes will appear here");

      // Only clear topic if it wasn't passed as an argument (manual new session click)
      if (!initialTopic) {
        setTopic("");
      }

      const historyRes = await api.get("/chats/page/learn");
      setChatHistory(historyRes.data.chatSessions || []);
      toast.success("New session started");
      return res.data.chatSession._id;
    } catch {
      toast.error("Failed to start session");
      return null;
    }
  };

  const generateNotes = async () => {
    if (!topic.trim()) return toast.warning("Enter a topic");
    setIsLoading(true);

    // If no session exists, start one first with the current topic as title
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = await startNewSession(topic);
      if (!sessionId) {
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await api.post("/prompt/learning-material", {
        title: title !== "Learning Notes" ? title : topic, // Use topic if title is default
        topic,
        level,
        chatSessionId: sessionId,
      });

      const content = res.data.data?.material?.content;
      setMarkdown(typeof content === 'string' ? content : JSON.stringify(content));
      setCurrentSessionId(res.data.data?.sessionId || sessionId);
      setTopic("");

      // Refresh history to show updated title if needed
      const historyRes = await api.get("/chats/page/learn");
      setChatHistory(historyRes.data.chatSessions || []);

    } catch (error) {
      if (error.response && error.response.status === 429) {
        toast.error(error.response.data.message || "Daily token limit exceeded!");
      } else {
        toast.error("Failed to generate notes");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = async (chat) => {
    const res = await api.get(`/chats/${chat._id}`);
    const messages = res.data.chatSession.messages;
    const aiMsgs = messages.filter((m) => m.role === "ai");
    if (aiMsgs.length > 0) setMarkdown(aiMsgs[aiMsgs.length - 1].content);
    setCurrentSessionId(chat._id);
    setShowHistory(false);
  };

  const deleteChat = async (id) => {
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
              <FiTerminal className="text-blue-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Learning
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
            <h3 className="text-[10px] font-black text-slate-400/80 uppercase tracking-[0.2em] mb-4 pl-2">Recent Notes</h3>
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
                    {chat.title || "Untitled Session"}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteChat(chat._id); }}
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

        {/* Content Area - Full Screen Layout */}
        <section className="flex-1 w-full bg-white overflow-y-auto p-12 custom-scrollbar text-slate-800">
          <div className="max-w-5xl mx-auto pb-10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Mastering Knowledge...</h3>
              </div>
            ) : parsedData ? (
              <StructuredNotes data={parsedData} />
            ) : (
              <div className="prose prose-slate max-w-none
                    prose-headings:text-black
                    prose-headings:font-black
                    prose-p:text-slate-600
                    prose-p:leading-relaxed
                    prose-li:text-slate-600
                    prose-strong:text-black
                    prose-code:text-blue-600
                    prose-code:bg-blue-50/50
                    prose-code:px-1.5
                    prose-code:py-0.5
                    prose-code:rounded-md
                    prose-code:before:content-none
                    prose-code:after:content-none">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="rounded-xl overflow-hidden my-6 shadow-sm border border-slate-200 ">
                          <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {match[1]}
                            </span>
                            <FiTerminal className="text-slate-500" size={12} />
                          </div>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: 0,
                              padding: "1.5rem",
                              fontSize: "0.85rem",
                              background: "#0f172a",
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </section>

        {/* ChatGPT Style Floating Bottom Input */}
        <section className="z-30 flex justify-center px-4 pb-6">
          <div className="max-w-4xl w-full">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
              <form
                onSubmit={(e) => { e.preventDefault(); generateNotes(); }}
                className="relative flex flex-col gap-3 bg-white border border-slate-200 p-4 rounded-[1.8rem] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:border-slate-300 transition-all focus-within:border-blue-500/50"
              >
                <div className="flex gap-2 items-center px-2">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Session Title"
                    className="flex-1 bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 focus:ring-1 focus:ring-blue-500/20 outline-none"
                  />
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 focus:ring-1 focus:ring-blue-500/20 outline-none cursor-pointer"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      ref={textareaRef}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          generateNotes();
                        }
                      }}
                      placeholder="What do you want to learn about?"
                      className="w-full bg-transparent p-2 focus:outline-none resize-none text-slate-800 font-semibold text-lg max-h-[200px] min-h-[44px] custom-scrollbar"
                      style={{ height: topic ? 'auto' : '44px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !topic.trim()}
                    className="w-11 h-11 bg-slate-900 text-white rounded-[1.2rem] flex items-center justify-center hover:bg-slate-800 transition active:scale-90 disabled:opacity-20 disabled:grayscale"
                  >
                    <FiSend size={20} />
                  </button>
                </div>
              </form>
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

export default Learn;
