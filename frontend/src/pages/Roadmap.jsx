import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiClock, FiSend, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function Roadmap() {
  const [topic, setTopic] = useState('');
  const [markdown, setMarkdown] = useState('## Roadmap\nYour roadmap will appear here');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [topic]);

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop = previewRef.current.scrollHeight;
    }
  }, [markdown]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await api.get('/roadmap/sessions');
        setChatHistory(response.data.roadmapSessions || []);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast.error('Failed to load roadmap history');
      }
    };
    
    fetchChatHistory();
  }, []);

  const handleGenerateRoadmap = async (e) => {
    e?.preventDefault(); // Prevent form submission if called from form
    
    if (!topic.trim()) {
      toast.warning('Please enter a topic for the roadmap');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('/roadmap/generate', { 
        sessionId: currentSessionId,
        topic 
      });
      
      if (response.data.roadmapSession) {
        setMarkdown(response.data.roadmapSession.messages?.[0]?.content || '## Roadmap\nYour roadmap will appear here');
        setCurrentSessionId(response.data.roadmapSession._id);
      } else {
        setMarkdown(response.data.roadmap || '## Roadmap\nYour roadmap will appear here');
      }
      
      setTopic('');
      
      const historyResponse = await api.get('/roadmap/sessions');
      setChatHistory(historyResponse.data.roadmapSessions || []);
      
      toast.success('Roadmap generated successfully');
    } catch (error) {
      console.error('Error generating roadmap:', error);
      const errorMessage = error.response?.data?.message || 'Failed to generate roadmap. Please try again.';
      toast.error(errorMessage);
      setMarkdown(`## Error\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewRoadmap = async () => {
    try {
      const response = await api.post('/roadmap/sessions', { 
        title: 'New Roadmap' 
      });
      
      setCurrentSessionId(response.data.roadmapSession._id);
      setTopic('');
      setMarkdown('## Roadmap\nYour roadmap will appear here');
      setShowHistory(false);
      
      const historyResponse = await api.get('/roadmap/sessions');
      setChatHistory(historyResponse.data.roadmapSessions || []);
      
      toast.success('New roadmap session started');
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error('Error creating new session:', error);
      toast.error('Failed to create a new roadmap session');
    }
  };

  const loadRoadmap = async (roadmap) => {
    try {
      const response = await api.get(`/roadmap/sessions/${roadmap._id}`);
      const session = response.data.roadmapSession;
      
      const messages = session.messages || [];
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        setMarkdown(lastMessage.content);
      }
      
      setCurrentSessionId(roadmap._id);
      setShowHistory(false);
    } catch (error) {
      console.error('Error loading roadmap:', error);
      toast.error('Failed to load roadmap session');
    }
  };
  
  const deleteRoadmap = async (roadmapId, e) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      try {
        await api.delete(`/roadmap/sessions/${roadmapId}`);
        
        setChatHistory(prev => prev.filter(roadmap => roadmap._id !== roadmapId));
        
        if (currentSessionId === roadmapId) {
          setMarkdown('## Roadmap\nYour roadmap will appear here');
          setCurrentSessionId(null);
        }
        
        toast.success('Roadmap deleted successfully');
      } catch (error) {
        console.error('Error deleting roadmap:', error);
        toast.error('Failed to delete roadmap');
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Header with buttons */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
          Roadmap Generator
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={startNewRoadmap}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5"
          >
            <FiPlus className="mr-2" />
            New Roadmap
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center px-5 py-2.5 rounded-lg transition-all duration-300 ${
              showHistory ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FiClock className="mr-2" />
            History
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Sidebar */}
        {showHistory && (
          <div className="w-72 bg-gray-800 border-r border-gray-700 overflow-y-auto transition-all duration-300 ease-in-out">
            <div className="p-4 border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
              <h2 className="font-semibold text-lg text-gray-200">Roadmap History</h2>
              <p className="text-xs text-gray-400 mt-1">Your previous roadmap sessions</p>
            </div>
            <div className="divide-y divide-gray-700">
              {chatHistory.map((roadmap) => {
                const firstMessage = roadmap.messages?.[0]?.content || 'Untitled';
                const previewText = firstMessage.split('\n')[0].replace(/^#+\s*/, '').substring(0, 50);
                
                return (
                  <div 
                    key={roadmap._id}
                    className={`p-4 hover:bg-gray-700/50 cursor-pointer group relative transition-colors duration-200 ${
                      currentSessionId === roadmap._id ? 'bg-gray-700/70 border-l-4 border-purple-400' : 'border-l-4 border-transparent'
                    }`}
                    onClick={() => loadRoadmap(roadmap)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm text-gray-200 line-clamp-2 pr-5 font-medium">
                        {previewText || 'Untitled Roadmap'}
                      </div>
                      <button 
                        onClick={(e) => deleteRoadmap(roadmap._id, e)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1.5 rounded-full hover:bg-gray-600 transition-colors duration-200"
                        title="Delete roadmap"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-2 flex items-center">
                      <span className="bg-gray-700 px-2 py-0.5 rounded-full">
                        {new Date(roadmap.updatedAt || roadmap.createdAt).toLocaleDateString()}
                      </span>
                      <span className="ml-2 text-gray-500">
                        {new Date(roadmap.updatedAt || roadmap.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  </div>
                );
              })}
              {chatHistory.length === 0 && (
                <div className="p-8 text-center">
                  <div className="bg-gray-800/50 rounded-xl p-6 max-w-xs mx-auto">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiClock className="text-gray-500 text-xl" />
                    </div>
                    <p className="text-gray-400 text-sm">No roadmap sessions yet</p>
                    <p className="text-gray-500 text-xs mt-1">Create a new roadmap to begin</p>
                    <button 
                      onClick={startNewRoadmap}
                      className="mt-4 px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                    >
                      New Roadmap
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Roadmap Preview */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              <h2 className="font-semibold text-xl text-gray-200 flex items-center">
                <span className="w-2 h-2 rounded-full bg-pink-400 mr-2"></span>
                Roadmap
              </h2>
            </div>
            <div 
              ref={previewRef}
              className="flex-1 overflow-auto p-6 bg-gradient-to-br from-gray-900/50 to-gray-900"
            >
              <div className="prose prose-invert max-w-4xl mx-auto">
                <style jsx global>{`
                  .prose {
                    --tw-prose-headings: #f3f4f6;
                    --tw-prose-links: #a78bfa;
                    --tw-prose-bold: #f3f4f6;
                    --tw-prose-code: #f3f4f6;
                    --tw-prose-quotes: #9ca3af;
                    --tw-prose-quote-borders: #a78bfa;
                    --tw-prose-hr: #374151;
                    --tw-prose-links-hover: #c4b5fd;
                    --tw-prose-invert-code: #f3f4f6;
                  }
                  .prose h1 {
                    font-size: 36px;
                    margin-top: 40px;
                    margin-bottom: 24px;
                    font-weight: 700;
                    line-height: 1.2;
                    color: #e9d5ff;
                  }
                  .prose h2 {
                    font-size: 30px;
                    margin-top: 36px;
                    margin-bottom: 20px;
                    font-weight: 600;
                    line-height: 1.25;
                    color: #e9d5ff;
                  }
                  .prose h3 {
                    font-size: 24px;
                    margin-top: 32px;
                    margin-bottom: 16px;
                    font-weight: 600;
                    line-height: 1.3;
                    color: #e9d5ff;
                  }
                  .prose h4 {
                    font-size: 20px;
                    margin-top: 24px;
                    margin-bottom: 12px;
                    font-weight: 600;
                    color: #e9d5ff;
                  }
                  .prose p {
                    font-size: 18px;
                    margin-top: 20px;
                    margin-bottom: 20px;
                    line-height: 1.7;
                    color: #e5e7eb;
                  }
                  .prose ul, .prose ol {
                    margin-top: 20px;
                    margin-bottom: 20px;
                    padding-left: 28px;
                  }
                  .prose li {
                    font-size: 18px;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    line-height: 1.6;
                  }
                  .prose code {
                    font-family: 'Fira Code', 'Menlo', monospace;
                    font-size: 16px;
                    background: rgba(139, 92, 246, 0.2);
                    padding: 2px 6px;
                    border-radius: 4px;
                    color: #c4b5fd;
                  }
                  .prose a {
                    color: #a78bfa;
                    text-decoration: none;
                    transition: color 0.15s ease;
                    font-weight: 500;
                  }
                  .prose a:hover {
                    color: #c4b5fd;
                    text-decoration: underline;
                  }
                  .prose blockquote {
                    margin: 24px 0;
                    padding: 12px 0 12px 20px;
                    border-left: 4px solid #a78bfa;
                    color: #d1d5db;
                    font-style: italic;
                    background: rgba(168, 85, 247, 0.05);
                    border-radius: 0 6px 6px 0;
                  }
                  .prose pre {
                    background: #1e1b4b;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 24px 0;
                    overflow-x: auto;
                    border: 1px solid #4c1d95;
                  }
                  .prose hr {
                    border-color: #4c1d95;
                    margin: 32px 0;
                    border-top-width: 1px;
                  }
                  .prose strong {
                    color: #e9d5ff;
                    font-weight: 600;
                  }
                  .prose code::before, .prose code::after {
                    content: '';
                  }
                `}</style>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="rounded-xl overflow-hidden my-6 border border-purple-900/50 shadow-lg">
                          <div className="bg-purple-900/80 px-4 py-2.5 text-xs font-mono text-purple-200 border-b border-purple-800 flex items-center justify-between">
                            <span className="flex items-center">
                              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-2"></span>
                              {match[1]}
                            </span>
                            <button 
                              className="text-purple-300 hover:text-white transition-colors"
                              onClick={() => {
                                navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                toast.success('Code copied to clipboard');
                              }}
                              title="Copy to clipboard"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H15C16.1046 21 17 20.1046 17 19V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 5C15 3.89543 15.8954 3 17 3H19C20.1046 3 21 3.89543 21 5V17C21 18.1046 20.1046 19 19 19H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            showLineNumbers
                            customStyle={{
                              margin: 0,
                              padding: '1rem',
                              background: '#1e1b4b',
                              fontSize: '16px',
                              lineHeight: '1.5',
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={`${className} bg-purple-900/30 text-purple-300 px-2 py-0.5 rounded-md font-mono text-sm border border-purple-800/50`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    a: ({node, ...props}) => (
                      <a className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="list-disc pl-6 space-y-2 my-4" {...props} />
                    ),
                    ol: ({node, ...props}) => (
                      <ol className="list-decimal pl-6 space-y-2 my-4" {...props} />
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-purple-500 pl-4 my-6 text-gray-300 italic bg-purple-900/10 py-2 rounded-r-lg" {...props} />
                    ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-purple-500 animate-pulse"></div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-400 font-medium">Generating your roadmap</p>
                    <p className="text-sm text-gray-500 mt-1">This may take a moment...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className={`border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm transition-all duration-300 ${isExpanded ? 'flex-1 flex flex-col' : ''}`}>
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-medium text-gray-300">Generate Roadmap</h3>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <FiChevronDown size={20} /> : <FiChevronUp size={20} />}
              </button>
            </div>
            {isExpanded && (
              <form onSubmit={handleGenerateRoadmap} className="flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Describe the topic or technology you want a roadmap for:</p>
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Learn React, Master Python for Data Science, etc."
                      className="w-full bg-gray-800 text-gray-100 rounded-lg p-4 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !topic.trim()}
                      className={`absolute bottom-3 right-3 p-2 rounded-full ${
                        isLoading || !topic.trim()
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transform hover:scale-105 transition-all'
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      ) : (
                        <FiSend size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 text-center">
                    Tip: Be specific about your goals and current skill level for a more tailored roadmap.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roadmap;