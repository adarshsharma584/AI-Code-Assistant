import React, { useState, useRef, useEffect } from 'react';
import { FiPlus, FiClock, FiSend, FiTrash2 } from 'react-icons/fi';
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

function Review() {
  const [code, setCode] = useState('// Write your code here...');
  const [markdown, setMarkdown] = useState('## Code Review\nYour reviewed code will appear here');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const codeEditorRef = useRef(null);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await api.get('/review/sessions');
        setChatHistory(response.data.reviewSessions || []);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        toast.error('Failed to load chat history');
      }
    };
    
    fetchChatHistory();
  }, []);

  const handleReview = async () => {
    if (!code.trim()) {
      toast.warning('Please enter some code to review');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('/review/submit', { 
        sessionId: currentSessionId,
        code 
      });
      
      setMarkdown(response.data.review);
      setCurrentSessionId(response.data.sessionId);
      
      const historyResponse = await api.get('/review/sessions');
      setChatHistory(historyResponse.data.reviewSessions || []);
      
      toast.success('Code review completed successfully');
    } catch (error) {
      console.error('Error getting review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to get review. Please try again.';
      toast.error(errorMessage);
      setMarkdown(`## Error\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async () => {
    try {
      const response = await api.post('/review/sessions', { 
        title: 'New Code Review' 
      });
      
      setCurrentSessionId(response.data.reviewSession._id);
      setCode('// Write your code here...');
      setMarkdown('## Code Review\nYour reviewed code will appear here');
      
      const historyResponse = await api.get('/review/sessions');
      setChatHistory(historyResponse.data.reviewSessions || []);
      
      toast.success('New review session started');
    } catch (error) {
      console.error('Error creating new session:', error);
      toast.error('Failed to create a new review session');
    }
  };

  const loadChat = async (chat) => {
    try {
      const response = await api.get(`/review/sessions/${chat._id}`);
      const session = response.data.reviewSession;
      
      const messages = session.messages || [];
      if (messages.length >= 2) {
        const userMessage = messages.find(m => m.role === 'user');
        const aiMessage = messages.find(m => m.role === 'ai');
        
        if (userMessage) setCode(userMessage.content);
        if (aiMessage) setMarkdown(aiMessage.content);
      }
      
      setCurrentSessionId(chat._id);
      setShowHistory(false);
    } catch (error) {
      console.error('Error loading chat:', error);
      toast.error('Failed to load chat session');
    }
  };
  
  const deleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent triggering the loadChat function
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await api.delete(`/review/sessions/${chatId}`);
        
        setChatHistory(prev => prev.filter(chat => chat._id !== chatId));
        
        if (currentSessionId === chatId) {
          setCode('// Write your code here...');
          setMarkdown('## Code Review\nYour reviewed code will appear here');
          setCurrentSessionId(null);
        }
        
        toast.success('Chat deleted successfully');
      } catch (error) {
        console.error('Error deleting chat:', error);
        toast.error('Failed to delete chat');
      }
    }
  };

  useEffect(() => {
    if (codeEditorRef.current) {
      codeEditorRef.current.style.height = 'auto';
      codeEditorRef.current.style.height = `${codeEditorRef.current.scrollHeight}px`;
    }
  }, [code]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Header with buttons */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Code Review Assistant
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={startNewChat}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
          >
            <FiPlus className="mr-2" />
            New Chat
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center px-5 py-2.5 rounded-lg transition-all duration-300 ${showHistory ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
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
              <h2 className="font-semibold text-lg text-gray-200">Chat History</h2>
              <p className="text-xs text-gray-400 mt-1">Your previous review sessions</p>
            </div>
            <div className="divide-y divide-gray-700">
              {chatHistory.map((chat) => {
                const firstMessage = chat.messages?.find(m => m.role === 'user');
                const previewText = firstMessage?.content?.split('\n')[0] || 'Untitled';
                
                return (
                  <div 
                    key={chat._id}
                    className={`p-4 hover:bg-gray-700/50 cursor-pointer group relative transition-colors duration-200 ${
                      currentSessionId === chat._id ? 'bg-gray-700/70 border-l-4 border-blue-400' : 'border-l-4 border-transparent'
                    }`}
                    onClick={() => loadChat(chat)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-sm text-gray-200 line-clamp-2 pr-5 font-medium">
                        {previewText}
                      </div>
                      <button 
                        onClick={(e) => deleteChat(chat._id, e)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1.5 rounded-full hover:bg-gray-600 transition-colors duration-200"
                        title="Delete chat"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-2 flex items-center">
                      <span className="bg-gray-700 px-2 py-0.5 rounded-full">
                        {new Date(chat.updatedAt || chat.createdAt).toLocaleDateString()}
                      </span>
                      <span className="ml-2 text-gray-500">
                        {new Date(chat.updatedAt || chat.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                    <p className="text-gray-400 text-sm">No review sessions yet</p>
                    <p className="text-gray-500 text-xs mt-1">Start a new chat to begin</p>
                    <button 
                      onClick={startNewChat}
                      className="mt-4 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                      New Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Code Editor */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-r border-gray-700 bg-gray-900">
            <div className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              <h2 className="font-semibold text-xl text-gray-200 flex items-center">
                <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                Your Code
              </h2>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-gray-900/50">
              <div className="relative h-full rounded-lg overflow-hidden border border-gray-700 bg-gray-800/50">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 flex items-center px-4 text-xs text-gray-400 font-mono">
                  index.js
                </div>
                <textarea
                  ref={codeEditorRef}
                  value={code}
                  onChange={handleCodeChange}
                  className="w-full h-full p-4 pt-12 font-mono text-xl bg-transparent text-gray-200 focus:outline-none resize-none"
                  style={{ minHeight: '200px' }}
                  placeholder="// Paste your code here for review..."
                  disabled={isLoading}
                  spellCheck="false"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-700 bg-gray-800/30 flex justify-end">
              <button
                onClick={handleReview}
                disabled={isLoading}
                className="flex items-center px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Reviewing...
                  </>
                ) : (
                  <>
                    Review Code
                    <FiSend className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Markdown Preview */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-gray-900">
            <div className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
              <h2 className="font-semibold text-xl text-gray-200 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                Code Review
              </h2>
            </div>
            <div className="flex-1 overflow-auto px-6  bg-gray-900">
              <div className="prose prose-invert max-w-4xl mx-auto px-4">
                <style jsx global>{`
                  .prose {
                    --tw-prose-headings: #f3f4f6;
                    --tw-prose-links: #60a5fa;
                    --tw-prose-bold: #f3f4f6;
                    --tw-prose-code: #f3f4f6;
                    --tw-prose-quotes: #9ca3af;
                    --tw-prose-quote-borders: #3b82f6;
                    --tw-prose-hr: #374151;
                    --tw-prose-links-hover: #93c5fd;
                    --tw-prose-invert-code: #f3f4f6;
                  }
                  .prose h1 {
                    font-size: 36px;
                    margin-top: 40px;
                    margin-bottom: 24px;
                    font-weight: 700;
                    line-height: 1.2;
                  }
                  .prose h2 {
                    font-size: 30px;
                    margin-top: 36px;
                    margin-bottom: 20px;
                    font-weight: 600;
                    line-height: 1.25;
                  }
                  .prose h3 {
                    font-size: 24px;
                    margin-top: 32px;
                    margin-bottom: 16px;
                    font-weight: 600;
                    line-height: 1.3;
                  }
                  .prose p {
                    font-size: 20px;
                    margin-top: 24px;
                    margin-bottom: 24px;
                    line-height: 1.7;
                    color: #e5e7eb;
                  }
                  .prose ul, .prose ol {
                    margin-top: 20px;
                    margin-bottom: 20px;
                    padding-left: 24px;
                  }
                  .prose li {
                    font-size: 20px;
                    margin-top: 8px;
                    margin-bottom: 8px;
                  }
                  .prose code {
                    font-family: 'Fira Code', 'Menlo', monospace;
                    font-size: 14px;
                    background: rgba(55, 65, 81, 0.5);
                    padding: 2px 6px;
                    border-radius: 4px;
                  }
                  .prose a {
                    font-size: 20px;
                    color: #60a5fa;
                    text-decoration: none;
                    transition: color 0.15s ease;
                  }
                  .prose a:hover {
                    color: #93c5fd;
                    text-decoration: underline;
                  }
                  .prose blockquote {
                    margin: 24px 0;
                    padding: 8px 0 8px 16px;
                    border-left: 4px solid #3b82f6;
                    color: #9ca3af;
                    font-style: normal;
                  }
                  .prose pre {
                    font-size: 20px;
                    background: #1f2937;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 24px 0;
                    overflow-x: auto;
                  }
                  .prose hr {
                    border-color: #374151;
                    margin: 40px 0;
                  }
                `}</style>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="rounded-xl overflow-hidden my-6 border border-gray-700 shadow-lg">
                          <div className="bg-gray-800/80 px-4 py-2.5 text-xs font-mono text-gray-300 border-b border-gray-700 flex items-center justify-between">
                            <span className="flex items-center">
                              <span className="w-2.5 h-2.5 rounded-full bg-gray-500 mr-2"></span>
                              {match[1]}
                            </span>
                            <button className="text-gray-400 hover:text-gray-200 transition-colors">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H17C18.1046 21 19 20.1046 19 19V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                              background: '#1e1e1e',
                              fontSize: '0.9em',
                              lineHeight: '1.5',
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={`${className} bg-gray-800/80 text-pink-400 px-2 py-1 rounded-md font-mono text-sm border border-gray-700`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    a: ({node, ...props}) => (
                      <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="list-disc pl-6 space-y-1 my-2" {...props} />
                    ),
                    ol: ({node, ...props}) => (
                      <ol className="list-decimal pl-6 space-y-1 my-2" {...props} />
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 my-4 text-gray-300 italic" {...props} />
                    ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-blue-500 animate-pulse"></div>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-400 font-medium">Analyzing your code</p>
                  <p className="text-sm text-gray-500 mt-1">This usually takes a few seconds...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;