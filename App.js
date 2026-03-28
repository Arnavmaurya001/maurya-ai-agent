const { useState, useEffect, useRef, useMemo, useCallback } = React;

/**
 * 
 * INLINED LUCIDE ICONS (SVG COMPONENTS)
 * 
 */

const Icon = ({ children, size = 18, color = 'currentColor', className = '' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {children}
    </svg>
);

const Plus = (props) => (
    <Icon {...props}><path d="M5 12h14"/><path d="M12 5v14"/></Icon>
);
const History = (props) => (
    <Icon {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></Icon>
);
const Trash2 = (props) => (
    <Icon {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></Icon>
);
const Menu = (props) => (
    <Icon {...props}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></Icon>
);
const X = (props) => (
    <Icon {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>
);
const Search = (props) => (
    <Icon {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Icon>
);
const Key = (props) => (
    <Icon {...props}><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3-3.5 3.5z"/></Icon>
);
const Send = (props) => (
    <Icon {...props}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></Icon>
);
const Bot = (props) => (
    <Icon {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></Icon>
);
const User = (props) => (
    <Icon {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>
);
const Loader2 = (props) => (
    <Icon {...props} className={`animate-spin ${props.className || ''}`}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></Icon>
);
const Code = (props) => (
    <Icon {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></Icon>
);
const ChevronDown = (props) => (
    <Icon {...props}><path d="m6 9 6 6 6-6"/></Icon>
);
const Copy = (props) => (
    <Icon {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></Icon>
);
const Download = (props) => (
    <Icon {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Icon>
);
const Maximize = (props) => (
    <Icon {...props}><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></Icon>
);
const LogOut = (props) => (
    <Icon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>
);

/**
 * 
 * CORE API LOGIC (GEMINI)
 * 
 */

const GEMINI_TOOLS = {
    function_declarations: [
        {
            name: "read_file",
            description: "Read the contents of a file from the virtual filesystem.",
            parameters: { type: "OBJECT", properties: { path: { type: "STRING" } }, required: ["path"] }
        },
        {
            name: "write_file",
            description: "Write content to a file in the virtual filesystem.",
            parameters: { type: "OBJECT", properties: { path: { type: "STRING" }, content: { type: "STRING" } }, required: ["path", "content"] }
        },
        {
            name: "web_search",
            description: "Perform a real-time web search for any query.",
            parameters: { type: "OBJECT", properties: { query: { type: "STRING" } }, required: ["query"] }
        }
    ]
};

const callGemini = async (apiKey, contents, systemPrompt) => {
    let retries = 3;
    let lastError = null;

    while (retries > 0) {
        try {
            const response = await fetch('/api/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(apiKey ? { 'x-api-key': apiKey } : {})
                },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    model: "gemini-2.5-flash",
                    contents: contents,
                    tools: [GEMINI_TOOLS]
                })
            });

            const data = await response.json();
            
            if (data.error) {
                const msg = data.error.message || 'Gemini API Error';
                
                // If Rate Limited (429) or Quota Exceeded, attempt retry
                if (msg.includes('quota exceeded') || msg.includes('limit: 20') || response.status === 429) {
                    const waitMatch = msg.match(/retry in ([\d.]+)s/);
                    const seconds = waitMatch ? parseFloat(waitMatch[1]) : 2;
                    
                    console.warn(`Quota reached. Retrying in ${seconds}s... (${retries} left)`);
                    
                    if (retries > 1) {
                        await new Promise(r => setTimeout(r, Math.min(seconds * 1000, 5000))); // Max 5s wait per retry
                        retries--;
                        continue;
                    }

                    // On final retry, throw formatted error
                    const reactiveAt = new Date(Date.now() + seconds * 1000).toLocaleTimeString();
                    throw new Error(`Quota reached. Please wait ${seconds.toFixed(1)}s. System reactive at: ${reactiveAt}`);
                }
                throw new Error(msg);
            }

            return data;
        } catch (err) {
            lastError = err;
            if (retries <= 1) throw err;
            retries--;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    throw lastError;
};

/**
 * 
 * CORE HOOKS
 * 
 */

const useFS = () => {
    const [fileSystem, setFileSystem] = useState(() => {
        const saved = localStorage.getItem('virtual_fs');
        return saved ? JSON.parse(saved) : {
            'app.js': '// Welcome to Maurya AI\nconsole.log("Hello, Agent!");',
            'readme.md': '# Project Documentation\nStart by building something great.'
        };
    });

    useEffect(() => {
        localStorage.setItem('virtual_fs', JSON.stringify(fileSystem));
    }, [fileSystem]);

    return { fileSystem, setFileSystem };
};

const useAgent = () => {
    const apiKey = ''; // Predefined on Netlify Environment Variables
    const githubToken = ''; // Predefined on Netlify Environment Variables
    const githubOwner = 'Arnavmaurya001';
    const githubRepo = 'maurya-ai-agent';
    
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('chat_history');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentSessionId, setCurrentSessionId] = useState(null);


    const saveSession = useCallback((msgs) => {
        if (msgs.length === 0) return;
        const sessionId = currentSessionId || Date.now().toString();
        setCurrentSessionId(sessionId);
        
        const updatedHistory = [...history];
        const index = updatedHistory.findIndex(h => h.id === sessionId);
        
        const sessionSummary = {
            id: sessionId,
            title: typeof msgs[0]?.content === 'string' ? msgs[0]?.content.substring(0, 30) : 'New Chat',
            messages: msgs,
            updatedAt: new Date().toISOString()
        };

        if (index > -1) {
            updatedHistory[index] = sessionSummary;
        } else {
            updatedHistory.unshift(sessionSummary);
        }
        
        setHistory(updatedHistory);
        localStorage.setItem('chat_history', JSON.stringify(updatedHistory));
    }, [currentSessionId, history]);

    const executeTool = async (name, args) => {
        const ghHeaders = {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json'
        };

        try {
            switch (name) {
                case 'read_file':
                    console.log(`> Cloud Read: ${args.path}`);
                    const readRes = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${args.path}`, {
                        headers: ghHeaders
                    });
                    if (!readRes.ok) {
                        const err = await readRes.json();
                        return `Error: ${err.message || 'Failed to read from GitHub'}`;
                    }
                    const readData = await readRes.json();
                    // Handle base64 decoding safely for UTF-8
                    return decodeURIComponent(escape(atob(readData.content)));

                case 'write_file':
                    console.log(`> Cloud Write: ${args.path}`);
                    // 1. Get current file SHA if it exists
                    const existingFile = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${args.path}`, {
                        headers: ghHeaders
                    });
                    
                    let sha = null;
                    if (existingFile.ok) {
                        const existingData = await existingFile.json();
                        sha = existingData.sha;
                    }

                    // 2. Commit the change
                    const writeRes = await fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${args.path}`, {
                        method: 'PUT',
                        headers: ghHeaders,
                        body: JSON.stringify({
                            message: `Update ${args.path} via Maurya AI Agent`,
                            content: btoa(unescape(encodeURIComponent(args.content))),
                            sha: sha
                        })
                    });

                    if (!writeRes.ok) {
                        const err = await writeRes.json();
                        return `Error: ${err.message || 'Failed to write to GitHub'}`;
                    }
                    return `Successfully committed '${args.path}' to GitHub repository.`;

                case 'web_search':
                    console.log(`> Smart Relay Search: ${args.query}`);
                    // Perform a SECOND nested Gemini call specifically for search
                    const searchRes = await fetch('/api/proxy', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            system_instruction: { parts: [{ text: "You are a Search Specialist. Use Google Search to find accurate, up-to-date results for the provided query and provide a detailed summary. Be objective." }] },
                            model: "gemini-2.5-flash",
                            contents: [{ role: 'user', parts: [{ text: `Search for: ${args.query}` }] }],
                            tools: [{ google_search: {} }] // ONLY use search tool here to avoid conflict
                        })
                    });
                    
                    if (!searchRes.ok) return "Error: Failed to fetch real-time search results.";
                    const searchData = await searchRes.json();
                    
                    if (searchData.error) return `Error: ${searchData.error.message}`;
                    
                    const searchContent = searchData.candidates?.[0]?.content?.parts?.map(p => p.text).join(' ');
                    return searchContent || "No detailed search results found.";

                default:
                    return "Unknown tool";
            }
        } catch (err) {
            return `Error: ${err.message}`;
        }
    };

    const sendMessage = async (input) => {
        if (!input.trim()) return; // Removed apiKey check (Cloud Proxy will handle it)

        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setIsThinking(true);

        // GEMINI FORMAT: Contents array
        // Correctly handle history with text, tool_use, and tool_result
        let geminiContents = newMessages.map(m => {
            if (m.role === 'user') {
                return { role: 'user', parts: [{ text: m.content }] };
            } else if (m.role === 'function') {
                // This shouldn't happen here usually, but just in case
                return m;
            } else {
                // Model message: map our blocks to Gemini response parts
                const parts = m.content.map(block => {
                    if (block.type === 'text') return { text: block.text };
                    if (block.type === 'tool_use') return { functionCall: { name: block.name, args: block.input } };
                    return null;
                }).filter(Boolean);
                return { role: 'model', parts };
            }
        });

        try {
            let agentStillWorking = true;
            
            while (agentStillWorking) {
                const response = await callGemini(apiKey, geminiContents, "You are Maurya AI, a precise coding assistant with built-in Google Search. Use Google Search for any non-coding queries or current information. Reason step by step before acting.");
                
                const candidate = response.candidates[0];
                const modelParts = candidate.content.parts;
                
                // Map Gemini parts to our app structure
                const assistantMsg = { 
                    role: 'model', 
                    content: modelParts.map((p, idx) => {
                        if (p.text) return { type: 'text', text: p.text };
                        if (p.functionCall) {
                            const toolId = `${p.functionCall.name}_${Date.now().toString(36)}_${idx}`;
                            return { type: 'tool_use', name: p.functionCall.name, input: p.functionCall.args, id: toolId };
                        }
                        return null;
                    }).filter(Boolean),
                    groundingMetadata: candidate.groundingMetadata
                };
                
                setMessages(prev => [...prev, assistantMsg]);
                geminiContents.push(candidate.content);

                const toolCalls = assistantMsg.content.filter(b => b.type === 'tool_use');
                
                if (toolCalls.length === 0) {
                    saveSession([...newMessages, assistantMsg]);
                    agentStillWorking = false;
                } else {
                    const toolResultsParts = [];
                    for (const block of toolCalls) {
                        const result = await executeTool(block.name, block.input);
                        
                        toolResultsParts.push({
                            functionResponse: {
                                name: block.name,
                                response: { content: result }
                            }
                        });

                        // Update UI with results
                        setMessages(prev => {
                            const last = prev[prev.length - 1];
                            return [...prev.slice(0, -1), { 
                                ...last, 
                                toolResults: { ...(last.toolResults || {}), [block.id]: result } 
                            }];
                        });
                    }

                    geminiContents.push({
                        role: 'function',
                        parts: toolResultsParts
                    });
                }
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'model', content: `**Error:** ${err.message}` }]);
        } finally {
            setIsThinking(false);
        }
    };

    const startNewChat = () => {
        setMessages([]);
        setCurrentSessionId(null);
    };

    const loadSession = (session) => {
        setMessages(session.messages);
        setCurrentSessionId(session.id);
    };

    const deleteSession = (id) => {
        const updated = history.filter(h => h.id !== id);
        setHistory(updated);
        localStorage.setItem('chat_history', JSON.stringify(updated));
        if (currentSessionId === id) startNewChat();
    };

    return {
        messages, isThinking, history, currentSessionId, apiKey, sendMessage, 
        startNewChat, loadSession, deleteSession
    };
};

/**
 * 
 * CORE COMPONENTS
 * 
 */

const Sidebar = ({ history, currentSessionId, onNewChat, onLoadSession, onDeleteSession, isOpen, onClose, user, onLogout }) => {
    const userInitials = user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase() || '?';

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div onClick={onClose} className="fixed inset-0 z-50 glass md:hidden opacity-60" />
            )}
            
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0d0d0e] border-r border-[#1b1b1f] flex flex-col sidebar-transition md:translate-x-0 md:static md:z-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-[#1b1b1f] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="./logo.png" alt="Maurya AI Logo" className="w-5 h-5 rounded shadow-sm opacity-90" />
                        <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Workspace</span>
                    </div>
                </div>
                
                <div className="p-4">
                    <button 
                        onClick={() => { onNewChat(); if(window.innerWidth < 768) onClose(); }}
                        className="w-full h-11 flex items-center justify-center gap-2 bg-[#1b1b1f] hover:bg-[#27272a] text-sm font-medium rounded-xl border border-[#242427] transition-all active:scale-95 text-zinc-100"
                    >
                        <Plus size={18} /> New Chat
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                    {history.map(session => (
                        <div 
                            key={session.id}
                            onClick={() => { onLoadSession(session); if(window.innerWidth < 768) onClose(); }}
                            className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${currentSessionId === session.id ? 'bg-[#1b1b1f] text-white' : 'hover:bg-[#1b1b1f]/50 text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <History size={16} className="shrink-0" />
                                <span className="text-sm truncate font-medium">{session.title}</span>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-[#1b1b1f] bg-[#0d0d0e]">
                    <div className="flex items-center justify-between p-2 rounded-xl transition-all group">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-200">
                                {userInitials}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold text-zinc-200 truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</span>
                                <span className="text-[10px] text-zinc-550 truncate">Free Plan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

const Markdown = ({ content }) => {
    const html = useMemo(() => marked.parse(content || ""), [content]);
    useEffect(() => { if (window.Prism) window.Prism.highlightAll(); }, [html]);
    return <div className="prose prose-invert prose-sm max-w-none text-zinc-300 space-y-4" dangerouslySetInnerHTML={{ __html: html }} />;
};

const ToolCall = ({ toolCall, result }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const toolNames = {
        'web_search': 'Searching the web',
        'write_file': 'Generating file',
        'read_file': 'Reading code'
    };

    const isError = result && result.startsWith('Error:');

    return (
        <div className="flex flex-col">
            <button 
                onClick={() => setIsExpanded(!isExpanded)} 
                className={`tool-pill group ${isError ? 'error' : ''}`}
            >
                <div className="flex items-center gap-2.5">
                    {result ? (
                        isError ? <X size={14} className="text-red-500" /> : <Bot size={14} className="text-zinc-500" />
                    ) : (
                        <Loader2 size={14} className="animate-spin text-zinc-500" />
                    )}
                    <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        {toolNames[toolCall.name] || toolCall.name}
                        {result && !isError && ' (completed)'}
                    </span>
                    <ChevronDown size={12} className={`text-zinc-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            
            {isExpanded && (
                <div className="tool-details sidebar-transition">
                    <div className="text-zinc-500 mb-2 uppercase text-[9px] tracking-widest font-bold">Machine Data</div>
                    <pre className="text-zinc-400 overflow-x-auto">
                        {JSON.stringify(toolCall.input, null, 2)}
                    </pre>
                    {result && (
                        <>
                            <div className="mt-4 text-zinc-500 mb-2 uppercase text-[9px] tracking-widest font-bold">Response</div>
                            <div className={`text-xs ${isError ? 'text-red-400' : 'text-zinc-300'}`}>
                                {result}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const Message = ({ msg, onOpenArtifact }) => {
    const isUser = msg.role === 'user';
    
    // Check if message has code that could be an artifact
    const hasCode = !isUser && typeof msg.content === 'string' && msg.content.includes('```');

    return (
        <div className={`w-full group ${isUser ? 'flex justify-end' : 'ai-message'}`}>
            <div className={`flex gap-6 max-w-4xl mx-auto w-full px-4 ${isUser ? 'justify-end' : ''}`}>
                {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-1">
                        <Bot size={16} className="text-zinc-400" />
                    </div>
                )}
                
                <div className={`flex-1 min-w-0 ${isUser ? 'user-message' : ''}`}>
                    {Array.isArray(msg.content) ? (
                        msg.content.map((block, idx) => {
                            if (block.type === 'text') return <Markdown key={idx} content={block.text} />;
                            if (block.type === 'tool_use') return <ToolCall key={idx} toolCall={block} result={msg.toolResults?.[block.id]} />;
                            return null;
                        })
                    ) : (
                        <Markdown content={msg.content} />
                    )}
                    
                    {!isUser && msg.groundingMetadata?.groundingChunks && (
                        <div className="mt-6 pt-6 border-t border-zinc-900/50">
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                                <Search size={12} /> Search Grounding
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {msg.groundingMetadata.groundingChunks.map((chunk, i) => (
                                    chunk.web && (
                                        <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[11px] bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-all text-sky-400 truncate max-w-[240px]">
                                            {chunk.web.title || chunk.web.uri}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {isUser && (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-1">
                        <User size={16} />
                    </div>
                )}
            </div>
        </div>
    );
};

const Chat = ({ messages, isThinking, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isThinking]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isThinking) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <div className="flex-1 overflow-y-auto pt-8 pb-32">
                <div className="max-w-4xl mx-auto">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                                <Bot size={24} className="text-zinc-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-zinc-200 mb-2">How can I help you today?</h2>
                            <p className="text-zinc-500 max-w-sm">From coding apps to searching the web, I am ready to collaborate with you.</p>
                        </div>
                    )}
                    <div className="space-y-0">
                        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
                    </div>
                    {isThinking && (
                        <div className="max-w-4xl mx-auto px-14 py-6">
                            <Loader2 size={16} className="animate-spin text-zinc-600" />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                <div className="max-w-3xl mx-auto pointer-events-auto">
                    <form onSubmit={handleSubmit} className="input-island relative flex items-center p-2 gap-2">
                        <button type="button" className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors">
                            <Plus size={20} />
                        </button>
                        <input 
                            placeholder="Message Maurya AI..." value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent border-none py-3 text-sm outline-none text-white placeholder-zinc-600"
                        />
                        <button type="submit" disabled={!input.trim() || isThinking} className={`p-2 rounded-xl transition-all ${!input.trim() || isThinking ? 'text-zinc-700' : 'text-white bg-zinc-800 hover:bg-zinc-700'}`}>
                            <Send size={18} />
                        </button>
                    </form>
                    <div className="text-[10px] text-zinc-600 text-center mt-3 tracking-wide">
                        Maurya AI can make mistakes. Please verify important information.
                    </div>
                </div>
            </div>
        </div>
    );
};

const Header = ({ onToggleSidebar, user, onLogout }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const userInitials = user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase() || '?';

    return (
        <header className="py-2.5 border-b border-[#1b1b1f] flex items-center justify-between px-4 md:px-6 glass sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button 
                    onClick={onToggleSidebar}
                    className="p-2 text-zinc-400 hover:text-white transition-all bg-[#1b1b1f]/40 md:hidden rounded-lg"
                >
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-550 uppercase font-bold tracking-[0.2em]">Maurya AI Pro</span>
                </div>
            </div>
            
            <div className="flex items-center gap-5">
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-sky-500" />
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">3-Key Active</span>
                    </div>
                </div>
                {user && (
                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 pl-4 border-l border-[#242427] hover:opacity-80 transition-all outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-300">
                                {userInitials}
                            </div>
                        </button>
                        
                        {isProfileOpen && (
                            <>
                                <div onClick={() => setIsProfileOpen(false)} className="fixed inset-0 z-40" />
                                <div className="absolute right-0 mt-3 w-56 bg-[#0d0d0e] border border-[#1b1b1f] rounded-2xl shadow-2xl p-2 z-50 glass slide-up">
                                    <div className="px-3 py-3 border-b border-[#1b1b1f] mb-1">
                                        <div className="text-xs font-bold text-zinc-200 truncate">{user?.user_metadata?.full_name || 'Active User'}</div>
                                        <div className="text-[10px] text-zinc-500 truncate mt-0.5">{user?.email}</div>
                                    </div>
                                    <button 
                                        onClick={() => { onLogout(); setIsProfileOpen(false); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                    >
                                        <LogOut size={14} />
                                        Log out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

const ArtifactPanel = ({ artifact, onClose }) => {
    if (!artifact.isOpen) return null;
    return (
        <div className="artifact-pane w-full md:w-[600px] lg:w-[800px] flex flex-col h-full shadow-2xl relative z-40">
            <div className="artifact-header flex items-center justify-between p-4 px-6 h-14">
                <div className="flex items-center gap-4">
                    <div className="p-1.5 bg-zinc-800 rounded text-zinc-400"><Code size={14} /></div>
                    <span className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">{artifact.title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-zinc-500 hover:text-white transition-colors" title="Copy Code">
                        <Copy size={16} />
                    </button>
                    <button className="p-2 text-zinc-500 hover:text-white transition-colors" title="Download">
                        <Download size={16} />
                    </button>
                    <div className="w-px h-4 bg-zinc-800 mx-2" />
                    <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-[#09090b]">
                <pre className="text-xs leading-relaxed text-zinc-300 font-mono">
                    <code>{artifact.content}</code>
                </pre>
            </div>
        </div>
    );
};

const App = () => {
    const { 
        messages, isThinking, history, currentSessionId, apiKey, sendMessage, 
        startNewChat, loadSession, deleteSession
    } = useAgent();
    
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [artifact, setArtifact] = useState({ isOpen: false, title: '', content: '', language: '' });
    const [user, setUser] = useState(null);

    // Netlify Identity Logic
    useEffect(() => {
        if (window.netlifyIdentity) {
            // Immediate check for existing session
            const currentUser = window.netlifyIdentity.currentUser();
            if (currentUser) setUser(currentUser);

            window.netlifyIdentity.on('init', user => {
                if (user) setUser(user);
            });
            window.netlifyIdentity.on('login', user => {
                setUser(user);
                window.netlifyIdentity.close();
            });
            window.netlifyIdentity.on('logout', () => setUser(null));
        }
    }, []);

    const handleLogin = () => window.netlifyIdentity.open();
    const handleLogout = () => window.netlifyIdentity.logout();

    // Auto-detect artifacts in messages
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === 'model') {
            const toolCalls = lastMsg.content?.filter(c => c.type === 'tool_use' && c.name === 'write_file');
            if (toolCalls && toolCalls.length > 0) {
                const call = toolCalls[toolCalls.length - 1];
                setArtifact({
                    isOpen: true,
                    title: call.input.path,
                    content: call.input.content,
                    language: call.input.path.split('.').pop()
                });
            }
        }
    }, [messages]);

    if (!user) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0a0a0b] text-center p-6">
                <div className="w-20 h-20 mb-8 animate-float">
                    <img src="./logo.png" alt="Maurya AI Logo" className="w-full h-full rounded-2xl shadow-2xl border border-zinc-800" />
                </div>
                <h1 className="text-3xl font-semibold text-zinc-200 mb-4 tracking-tight">Welcome to Maurya AI Pro</h1>
                <p className="text-zinc-500 max-w-sm mb-10 leading-relaxed">A professional, private workspace for secure AI collaboration and coding.</p>
                <button 
                    onClick={handleLogin}
                    className="px-8 py-3 bg-white text-zinc-950 rounded-xl font-medium hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
                >
                    Sign In to Continue
                </button>
            </div>
        );
    }

    const userInitials = user.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0b] font-sans text-zinc-100 relative">
            <Sidebar 
                history={history} 
                currentSessionId={currentSessionId} 
                onNewChat={startNewChat} 
                onLoadSession={loadSession} 
                onDeleteSession={deleteSession}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                user={user}
                onLogout={handleLogout}
            />
            
            <div className="flex-1 flex overflow-hidden">
                <main className={`flex-1 flex flex-col relative overflow-hidden h-full sidebar-transition ${artifact.isOpen ? 'opacity-80 scale-[0.99] origin-left' : ''}`}>
                    <Header onToggleSidebar={() => setSidebarOpen(true)} user={user} onLogout={handleLogout} />
                    <Chat messages={messages} isThinking={isThinking} onSendMessage={sendMessage} />
                </main>
                
                <ArtifactPanel 
                    artifact={artifact} 
                    onClose={() => setArtifact({ ...artifact, isOpen: false })} 
                />
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
