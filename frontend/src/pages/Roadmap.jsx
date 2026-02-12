import React, { useState, useRef, useEffect } from "react";
import {
  FiPlus,
  FiClock,
  FiSend,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiSidebar,
  FiMenu,
  FiLayout,
  FiDownload,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { toPng } from 'html-to-image';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const nodeWidth = 240;
const nodeHeight = 70;
const horizontalGap = 320;
const verticalGap = 120;

function getNodeStyle(type) {
  const base = {
    borderRadius: 16,
    padding: "16px 20px",
    color: "#334155", // slate-700
    border: "2px solid #e2e8f0",
    fontSize: 14,
    width: nodeWidth,
    minHeight: nodeHeight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // slightly transparent for mesh effect
    backdropFilter: "blur(8px)",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
  };

  switch (type) {
    case "root":
      return {
        ...base,
        background: "#f8fafc",
        fontWeight: "bold",
        border: "3px solid #3b82f6", // blue-500
        boxShadow: "0 10px 15px -3px rgb(59 130 246 / 0.1)",
      };
    case "phase":
      return {
        ...base,
        border: "2px solid #94a3b8", // slate-400
        background: "#f1f5f9",
      };
    case "prerequisite":
      return {
        ...base,
        border: "2px solid #cbd5e1",
        background: "#f8fafc",
        borderStyle: "dashed",
      };
    case "topic":
      return {
        ...base,
        border: "2px solid #3b82f6",
      };
    case "subtopic":
      return {
        ...base,
        border: "1px solid #e2e8f0",
        fontSize: "13px",
      };
    default:
      return base;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Update interceptor to ensure token is fresh
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized access - redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

const RoadmapNode = ({ data, selected }) => {
  const style = getNodeStyle(data.type);
  return (
    <div
      style={style}
      className={`${selected ? "ring-2 ring-blue-500 scale-105" : "hover:scale-[1.02]"} transition-transform duration-200 cursor-pointer`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-blue-500 !border-white !border-2" />
      <div className="flex flex-col gap-1">
        <h4 className={`text-sm font-bold tracking-tight ${data.type === 'root' ? 'text-blue-700' : 'text-slate-800'}`}>
          {data.label}
        </h4>
        {data.topic && (
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{data.topic}</p>
        )}
        {data.description && (
          <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">{data.description}</p>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-blue-500 !border-white !border-2" />
    </div>
  );
};

// 1. Move nodeTypes OUTSIDE any component to prevent re-creation on render
const nodeTypes = {
  roadmapNode: RoadmapNode,
};

const FlowRoadmap = ({ nodes, edges, onNodesChange, onEdgesChange }) => {
  return (
    <div className="h-full w-full bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        className="roadmap-flow"
      >
        <Background color="#f1f5f9" gap={24} variant="lines" size={1} />
        <Controls className="!bg-white !border-slate-200 !shadow-lg" />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.type === 'root') return "#3b82f6";
            return "#e2e8f0";
          }}
          maskColor="rgba(255, 255, 255, 0.7)"
          style={{ height: 120, borderRadius: 12, border: '1px solid #e2e8f0' }}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};

function Roadmap() {
  const [topic, setTopic] = useState("");
  const [markdown, setMarkdown] = useState(
    "## Roadmap\nYour roadmap will appear here"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const textareaRef = useRef(null);
  const downloadRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setShowDownloadDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportAsImage = () => {
    const element = document.querySelector('.roadmap-flow');
    if (!element) return;

    setIsLoading(true);
    toPng(element, {
      backgroundColor: '#ffffff',
      style: {
        transform: 'scale(1)',
      }
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `roadmap-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Image exported!");
      })
      .catch((err) => {
        console.error("Image export failed:", err);
        toast.error("Failed to export image");
      })
      .finally(() => setIsLoading(false));
  };

  const exportAsMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `roadmap-${Date.now()}.md`;
    link.href = url;
    link.click();
    toast.success("Markdown exported!");
  };

  const exportAsJSON = () => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `roadmap-${Date.now()}.json`;
    link.href = url;
    link.click();
    toast.success("JSON exported!");
  };

  const onNodesChange = (changes) => {
    console.log("Nodes changing:", changes);
    setNodes((nds) => applyNodeChanges(changes, nds));
  };
  const onEdgesChange = (changes) => {
    console.log("Edges changing:", changes);
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  useEffect(() => {
    api
      .get("/roadmap/sessions")
      .then((res) => setChatHistory(res.data.roadmapSessions || []))
      .catch(() => toast.error("Failed to load history"));
  }, []);

  const transformToFlowData = (rawData) => {
    if (!rawData || !rawData.nodes) return { nodes: [], edges: [] };

    const { nodes: rawNodes } = rawData;
    const flowNodes = [];
    const flowEdges = [];

    const childrenMap = {};
    rawNodes.forEach(node => {
      const parentId = node.parent || 'root-container';
      if (!childrenMap[parentId]) childrenMap[parentId] = [];
      childrenMap[parentId].push(node);
    });

    const getSubtreeHeight = (nodeId) => {
      const children = childrenMap[nodeId] || [];
      if (children.length === 0) return verticalGap;
      const height = children.reduce((acc, child) => acc + getSubtreeHeight(child.id), 0);
      return Math.max(height, verticalGap);
    };

    const layout = (parentId, depth = 0, startY = 0) => {
      const children = childrenMap[parentId] || [];
      let currentY = startY;

      children
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .forEach((child) => {
          const subtreeHeight = getSubtreeHeight(child.id);
          const x = depth * horizontalGap;
          // Center the node in its reserved subtree height
          const y = currentY + (subtreeHeight / 2) - (nodeHeight / 2);

          flowNodes.push({
            id: child.id,
            type: 'roadmapNode',
            data: {
              label: child.label,
              type: child.type,
              topic: child.data?.topic || child.type,
              description: child.data?.description
            },
            position: { x, y }
          });

          if (child.parent && child.parent !== 'root-container') {
            flowEdges.push({
              id: `${child.parent}-${child.id}`,
              source: child.parent,
              target: child.id,
              type: "smoothstep",
              animated: true,
              style: { stroke: "#94a3b8", strokeWidth: 2 }
            });
          }

          layout(child.id, depth + 1, currentY);
          currentY += subtreeHeight;
        });
    };

    const roots = rawNodes.filter(n => !n.parent || n.type === 'root');
    let totalY = 0;

    roots.forEach(root => {
      const subtreeHeight = getSubtreeHeight(root.id);
      const x = 0;
      const y = totalY + (subtreeHeight / 2) - (nodeHeight / 2);

      flowNodes.push({
        id: root.id,
        type: 'roadmapNode',
        data: {
          label: root.label,
          type: 'root',
          topic: root.data?.topic || 'Start',
          description: root.data?.description
        },
        position: { x, y }
      });

      layout(root.id, 1, totalY);
      totalY += subtreeHeight + (verticalGap * 2);
    });

    return { nodes: flowNodes, edges: flowEdges };
  };

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
      const { nodes: fNodes, edges: fEdges } = transformToFlowData(res.data.roadmapData);
      setNodes(fNodes);
      setEdges(fEdges);

      setCurrentSessionId(res.data.sessionId);
      setTopic("");

      const history = await api.get("/roadmap/sessions");
      setChatHistory(history.data.roadmapSessions || []);
    } catch (err) {
      console.error("Roadmap generation error details:", err);
      toast.error(err.response?.data?.message || "Failed to generate roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const startNewRoadmap = async () => {
    const res = await api.post("/roadmap/sessions", { title: "New Roadmap" });
    setCurrentSessionId(res.data.roadmapSession._id);
    setMarkdown("## Roadmap\nYour roadmap will appear here");
    setNodes([]);
    setEdges([]);
    setTopic("");
  };

  const loadRoadmap = async (roadmap) => {
    const res = await api.get(`/roadmap/sessions/${roadmap._id}`);
    const messages = res.data.roadmapSession.messages || [];
    const lastAiMsg = [...messages].reverse().find(m => m.role === "ai");

    setMarkdown(lastAiMsg?.content || "");
    const roadmapData = lastAiMsg?.metadata?.roadmapData;

    console.log("Loading roadmap data:", roadmapData);
    const { nodes, edges } = transformToFlowData(roadmapData);
    setNodes(nodes);
    setEdges(edges);

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
    <div className="flex h-[calc(100vh-96px)] w-full bg-transparent overflow-hidden relative group/sidebar">
      {/* Sidebar - Premium Glass Aesthetic */}
      <aside className={`${showHistory ? 'w-[300px]' : 'w-0'} bg-white/60 backdrop-blur-xl border-r border-white/20 flex flex-col transition-all duration-[400ms] relative z-40 overflow-hidden shadow-[4px_0_24px_-4px_rgba(0,0,0,0.05)]`}>
        <div className="p-5 flex flex-col h-full min-w-[300px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <FiLayout className="text-blue-600" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Roadmaps
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
            onClick={startNewRoadmap}
            className="flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all duration-300 active:scale-95 shadow-lg shadow-slate-900/20 mb-6 group/btn"
          >
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shadow-inner group-hover/btn:scale-110 transition-transform">
              <FiPlus size={18} />
            </div>
            <span className="font-bold text-sm tracking-wide">Create New Path</span>
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <h3 className="text-[10px] font-black text-slate-400/80 uppercase tracking-[0.2em] mb-4 pl-2">Recent Learning</h3>
            <div className="space-y-2">
              {chatHistory.map((roadmap) => (
                <div
                  key={roadmap._id}
                  onClick={() => loadRoadmap(roadmap)}
                  className={`group p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-3 border ${currentSessionId === roadmap._id
                    ? "bg-white shadow-md border-blue-100/50 ring-1 ring-blue-500/10"
                    : "bg-transparent border-transparent hover:bg-white/40 hover:border-white/40"
                    }`}
                >
                  <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${currentSessionId === roadmap._id ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-300'}`} />
                  <p className={`flex-1 text-sm font-semibold line-clamp-1 leading-snug ${currentSessionId === roadmap._id ? "text-slate-800" : "text-slate-500"}`}>
                    {roadmap.messages?.[0]?.content || "Untitled Journey"}
                  </p>
                  <button
                    onClick={(e) => deleteRoadmap(roadmap._id, e)}
                    className={`p-1.5 hover:bg-red-50 rounded-lg transition-all ${currentSessionId === roadmap._id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
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
        {/* Toggle Sidebar Button (Floating when closed) */}
        {!showHistory && (
          <button
            onClick={() => setShowHistory(true)}
            className="absolute top-1/2 -left-3 z-50 p-3 bg-white/80 backdrop-blur-md border border-white/50 shadow-xl rounded-full text-slate-400 hover:text-blue-600 transition-all hover:scale-110 active:scale-95 -translate-y-1/2 group/toggle"
            title="Open Sidebar"
          >
            <FiSidebar size={18} className="rotate-180 group-hover/toggle:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* Minimal Floating Top Header (Centered) */}
        <div className="absolute top-6 left-0 right-0 h-10 pointer-events-none flex items-center justify-center z-30">
          <div className="pointer-events-auto glass-card px-5 py-2 rounded-full flex items-center gap-3 shadow-lg shadow-slate-200/20">
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase bg-slate-50/50 px-2 py-1 rounded-md border border-slate-100">v2.1</span>
            <div className="w-px h-3 bg-slate-200" />
            <span className="text-xs font-bold text-slate-700">
              {topic ? topic : "Roadmap Visualizer"}
            </span>
          </div>
        </div>

        {/* Download Button (Top Right) */}
        {nodes.length > 0 && (
          <div className="absolute top-6 right-6 z-40" ref={downloadRef}>
            <button
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
              className="px-4 py-2.5 glass-card shadow-sm rounded-xl text-slate-600 font-bold text-xs hover:border-blue-500/50 hover:text-blue-600 transition-all active:scale-95 flex items-center gap-2 backdrop-blur-md bg-white/80"
            >
              <FiDownload size={14} />
              Export
              <FiChevronDown size={12} className={`transition-transform duration-300 ${showDownloadDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDownloadDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 glass-panel border border-slate-100/50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <button
                  onClick={() => { exportAsImage(); setShowDownloadDropdown(false); }}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 hover:bg-blue-50/50 hover:text-blue-600 transition flex items-center gap-3 border-b border-slate-100/50"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  Export as PNG
                </button>
                <button
                  onClick={() => { exportAsMarkdown(); setShowDownloadDropdown(false); }}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 hover:bg-slate-50/50 hover:text-blue-600 transition flex items-center gap-3 border-b border-slate-100/50"
                >
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  Export as Markdown
                </button>
                <button
                  onClick={() => { exportAsJSON(); setShowDownloadDropdown(false); }}
                  className="w-full px-4 py-3 text-left text-xs font-bold text-slate-600 hover:bg-slate-50/50 hover:text-blue-600 transition flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        )}

        {/* Visualizer Area with Border */}
        <section className="flex-1 relative overflow-hidden flex flex-col p-4">
          <div className="flex-1 relative border border-white/30 rounded-[2.5rem] overflow-hidden glass-card shadow-2xl shadow-slate-200/20 ring-1 ring-white/50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center absolute inset-0 z-40 bg-white/40 backdrop-blur-sm">
                <div className="w-12 h-12 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.3em] animate-pulse">Generating Visual Path</h3>
              </div>
            ) : nodes.length > 0 ? (
              <div className="flex-1 w-full h-full bg-white/40 relative z-0 backdrop-blur-sm">
                <FlowRoadmap
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-12 animate-in fade-in zoom-in duration-700">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-slate-900/20 rotate-12 group hover:rotate-0 transition-all duration-500 cursor-default ring-4 ring-white/50">
                  <FiPlus className="text-white text-4xl" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight drop-shadow-sm">Where do you want to go?</h2>
                <p className="text-slate-500 max-w-sm text-base leading-relaxed font-medium">
                  Enter any career goal or complex topic to generate a structured, visual step-by-step roadmap.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ChatGPT Style Floating Bottom Input */}
        <section className="absolute bottom-8 left-0 right-0 z-30 flex justify-center px-4">
          <div className="max-w-3xl w-full">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
              <form
                onSubmit={handleGenerateRoadmap}
                className="relative flex items-end gap-3 glass-panel border border-white/50 p-4 rounded-[1.8rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:border-white/80 transition-all focus-within:ring-1 focus-within:ring-blue-500/20"
              >
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerateRoadmap(e);
                      }
                    }}
                    placeholder="Ask for a roadmap... (e.g. Master Backend with Node.js)"
                    className="w-full bg-transparent p-2 focus:outline-none resize-none text-slate-800 font-semibold text-lg max-h-[200px] min-h-[44px] custom-scrollbar placeholder:text-slate-400/80"
                    style={{ height: topic ? 'auto' : '44px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !topic.trim()}
                  className="w-11 h-11 bg-slate-900 text-white rounded-[1.2rem] flex items-center justify-center hover:bg-slate-800 transition active:scale-90 disabled:opacity-20 disabled:grayscale shadow-lg shadow-slate-900/20"
                >
                  <FiSend size={20} />
                </button>
              </form>
              <p className="text-[10px] text-center mt-3 font-bold text-slate-400 uppercase tracking-widest opacity-60">
                Agentic Roadmaps can occasionally produce unique paths. Verify milestones as you learn.
              </p>
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
          background: rgba(0, 0, 0, 0.05); /* Lighter for SaaS theme */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

export default Roadmap;
