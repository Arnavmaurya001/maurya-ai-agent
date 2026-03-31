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
const Sun = (props) => (
    <Icon {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></Icon>
);
const Moon = (props) => (
    <Icon {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></Icon>
);
const LogOut = (props) => (
    <Icon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>
);
const Paperclip = (props) => (
    <Icon {...props}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></Icon>
);
const Camera = (props) => (
    <Icon {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></Icon>
);
const Box = (props) => (
    <Icon {...props}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></Icon>
);
const BookOpen = (props) => (
    <Icon {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></Icon>
);
const Globe = (props) => (
    <Icon {...props}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></Icon>
);
const Wand = (props) => (
    <Icon {...props}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.21 1.21 0 0 0 1.72 0L21.64 5.36a1.21 1.21 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v1"/><path d="M19 2v1"/><path d="M10 2v1"/><path d="M7 2v1"/><path d="M15 2v1"/><path d="M8 11v1"/><path d="M8 5v1"/><path d="M20 10v1"/><path d="M14 5v1"/></Icon>
);
const Wrench = (props) => (
    <Icon {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 1 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></Icon>
);
const Check = (props) => (
    <Icon {...props}><polyline points="20 6 9 17 4 12"/></Icon>
);
const Mic = (props) => (
    <Icon {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></Icon>
);
const ChevronRight = (props) => (
    <Icon {...props}><path d="m9 18 6-6-6-6"/></Icon>
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
    // GitHub configuration is now handled server-side via Netlify functions
    
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
        try {
            switch (name) {
                case 'read_file':
                    console.log(`> Cloud Proxy Read: ${args.path}`);
                    const readRes = await fetch('/api/github', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'read', path: args.path })
                    });
                    const readData = await readRes.json();
                    if (!readRes.ok) return `Error: ${readData.error || 'Failed to read file'}`;
                    return readData.content;

                case 'write_file':
                    console.log(`> Cloud Proxy Write: ${args.path}`);
                    const writeRes = await fetch('/api/github', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            action: 'write', 
                            path: args.path, 
                            content: args.content 
                        })
                    });
                    const writeData = await writeRes.json();
                    if (!writeRes.ok) return `Error: ${writeData.error || 'Failed to write file'}`;
                    return `Successfully committed '${args.path}' to GitHub via secure proxy.`;

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
                const contentBlocks = Array.isArray(m.content) ? m.content : [{ type: 'text', text: m.content }];
                const parts = contentBlocks.map(block => {
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

                const blocks = Array.isArray(assistantMsg.content) ? assistantMsg.content : [];
                const toolCalls = blocks.filter(b => b.type === 'tool_use');
                
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
            setMessages(prev => [...prev, { role: 'model', content: [{ type: 'text', text: `**Error:** ${err.message}` }] }]);
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

const MobileHeader = () => (
    <div className="mobile-header">
        <div className="mobile-header-content">
            <img src="./logo.png" alt="M" className="h-8 w-8 rounded-lg shadow-sm" />
            <span className="mobile-logo-text">Maurya AI <span>Pro</span></span>
        </div>
    </div>
);

const Sidebar = ({ onNewChat, user, isDarkMode, onToggleTheme, onLogout, history, onLoadSession, onDeleteSession, currentSessionId }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    
    const userInitials = user?.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase() || '?';

    return (
        <>
            <aside className="sidebar-icon-strip">
                <div className="mb-8 desktop-only">
                    <img src="./logo.png" alt="M" className="w-8 h-8 rounded-lg" />
                </div>
                
                <button className="sidebar-icon-btn" title="Create New Chat" onClick={onNewChat}><Plus size={22} /></button>
                <button className="sidebar-icon-btn" title="Search"><Search size={22} /></button>
                <button 
                    className={`sidebar-icon-btn ${isHistoryOpen ? 'active' : ''}`} 
                    title="History"
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                >
                    <History size={22} />
                </button>
                <button className="sidebar-icon-btn" title="Project Tools"><Box size={22} /></button>
                <button className="sidebar-icon-btn" title="Code"><Code size={22} /></button>

                <div className="mt-auto flex flex-col items-center gap-4 pb-4">
                    <button 
                        onClick={onToggleTheme}
                        className="sidebar-icon-btn"
                        title="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    
                    <div className="relative">
                        <div 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)] cursor-pointer hover:border-[var(--accent)] transition-all"
                        >
                            {userInitials}
                        </div>
                        
                        {isProfileOpen && (
                            <>
                                <div onClick={() => setIsProfileOpen(false)} className="fixed inset-0 z-40" />
                                <div className="absolute left-14 bottom-0 w-56 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-2 z-50 glass slide-up overflow-hidden">
                                    <div className="px-3 py-3 border-b border-[var(--border-subtle)] mb-1">
                                        <div className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.user_metadata?.full_name || 'Active User'}</div>
                                        <div className="text-[10px] text-[var(--text-secondary)] truncate mt-0.5">{user?.email}</div>
                                    </div>
                                    <button 
                                        onClick={() => { onLogout(); setIsProfileOpen(false); }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <LogOut size={14} />
                                        Log out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {isHistoryOpen && (
                <>
                    <div className="drawer-overlay" onClick={() => setIsHistoryOpen(false)} />
                    <div className="history-drawer">
                        <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">History</h3>
                            <button onClick={() => setIsHistoryOpen(false)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
                        </div>
                        <div className="flex-1 overflow-auto p-3">
                            {history.length === 0 ? (
                                <div className="text-center py-12 text-zinc-600 text-xs italic">No history yet</div>
                            ) : (
                                history.map((session) => (
                                    <div 
                                        key={session.id} 
                                        onClick={() => { onLoadSession(session); if(window.innerWidth < 768) setIsHistoryOpen(false); }}
                                        className={`history-item group ${currentSessionId === session.id ? 'active' : ''}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate text-zinc-300 mb-0.5">
                                                {session.messages?.[0]?.content || "Empty chat"}
                                            </div>
                                            <div className="text-[10px] text-zinc-600">{new Date(session.updatedAt).toLocaleDateString()}</div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-red-500 transition-all rounded-lg"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t border-[var(--border-subtle)]">
                            <button 
                                onClick={() => { onNewChat(); setIsHistoryOpen(false); }}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-[var(--accent)] text-white rounded-xl text-xs font-bold uppercase tracking-widest"
                            >
                                <Plus size={14} /> New Chat
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

const Markdown = ({ content }) => {
    const html = useMemo(() => marked.parse(content || ""), [content]);
    useEffect(() => { if (window.Prism) window.Prism.highlightAll(); }, [html]);
    return <div className="prose prose-invert prose-sm max-w-none text-zinc-300 space-y-4" dangerouslySetInnerHTML={{ __html: html }} />;
};

const ToolCall = ({ toolCall, result }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    
    const toolNames = {
        'web_search': 'Fetching data',
        'write_file': 'Writing file',
        'read_file': 'Reading code'
    };

    const displayTitle = toolNames[toolCall.name] || 'Processing';
    const query = toolCall.input?.query || toolCall.input?.path || '';
    const isError = result && result.startsWith('Error:');

    return (
        <div className="my-6">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-all mb-4"
            >
                <span className="text-sm font-medium text-zinc-500">
                    {displayTitle} {query && `for "${query}"`}
                </span>
                <ChevronDown size={14} className={`text-zinc-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {isExpanded && (
                <div className="ml-2 border-l-2 border-zinc-900 pl-6 space-y-5 animate-slideDown">
                    {/* Processing Step */}
                    <div className="flex items-center gap-3">
                        <Wrench size={16} className="text-zinc-500" />
                        <span className="text-sm text-zinc-400 font-medium">{displayTitle}...</span>
                    </div>

                    {/* Result Step */}
                    {result && (
                        <div className="flex items-start gap-4">
                            <div className="mt-0.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] shadow-sm">
                                Result
                            </div>
                            <div className="flex-1 text-sm text-zinc-500 line-clamp-2 italic font-serif leading-relaxed">
                                {typeof result === 'string' ? result.substring(0, 120) : 'Data retrieved successfully'}...
                            </div>
                        </div>
                    )}

                    {/* Done Step */}
                    {result && (
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-zinc-900/50 flex items-center justify-center border border-zinc-800">
                                <Check size={12} className="text-emerald-500" />
                            </div>
                            <span className="text-sm text-zinc-400 font-medium">Done</span>
                        </div>
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
    const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [webSearchEnabled, setWebSearchEnabled] = useState(true);
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isThinking]);

    // Voice Command Logic
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            
            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                setInput(transcript);
            };
            
            recognitionRef.current.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
            };
        }
    }, []);

    const toggleVoice = () => {
        if (!recognitionRef.current) return alert("Speech recognition not supported in this browser.");
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setIsListening(!isListening);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setAttachedFiles(prev => [...prev, ...files.map(f => f.name)]);
        setIsAddMenuOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if ((!input.trim() && attachedFiles.length === 0) || isThinking) return;
        
        let finalInput = input;
        if (attachedFiles.length > 0) {
            finalInput = `[Files Attached: ${attachedFiles.join(', ')}]\n\n${input}`;
        }
        
        onSendMessage(finalInput);
        setInput('');
        setAttachedFiles([]);
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[var(--bg-primary)]">
            <div className="flex-1 overflow-y-auto pt-8 pb-32 scrollbar-none">
                <div className="max-w-4xl mx-auto px-4">
                    {messages.length === 0 ? (
                        <div className="centered-dashboard fade-in">
                            <div className="mb-10 animate-float opacity-80">
                                <div className="text-[var(--accent)] text-5xl mb-4">✴️</div>
                            </div>
                            <h2 className="greeting-text">Maurya Premium Thinking</h2>
                            
                            <div className="input-island-centered mb-8">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <textarea 
                                        placeholder="How can I help you today?" 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        rows={3}
                                        className="w-full bg-transparent border-none p-0 text-xl outline-none text-[var(--text-primary)] placeholder-zinc-400 resize-none"
                                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }}}
                                    />
                                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => setIsAddMenuOpen(!isAddMenuOpen)} className="p-2 text-zinc-400 hover:text-[var(--accent)]"><Plus size={22} /></button>
                                            <div className="bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-500 uppercase tracking-widest border border-[var(--border-subtle)]">
                                                Maurya 2.5 Pro
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button type="button" onClick={toggleVoice} className={`p-2 rounded-full transition-all ${isListening ? 'text-red-400 bg-red-400/10' : 'text-zinc-400 hover:text-[var(--accent)]'}`}><Mic size={22} /></button>
                                            <button type="submit" disabled={!input.trim() || isThinking} className="p-2.5 bg-[var(--accent)] text-white rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-30 shadow-lg"><Send size={20} /></button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="flex flex-wrap justify-center gap-3 mb-10">
                                <button className="quick-action-pill" onClick={() => setInput("Write a professional email...")}>✒️ Write</button>
                                <button className="quick-action-pill" onClick={() => setInput("Explain quantum physics simply...")}>🎓 Learn</button>
                                <button className="quick-action-pill" onClick={() => setInput("Write a React component for...")}>💻 Code</button>
                                <button className="quick-action-pill" onClick={() => setInput("What's interesting today?")}>✨ Maurya's Choice</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-0 py-8">
                            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
                        </div>
                    )}
                    
                    {isThinking && (
                        <div className="max-w-4xl mx-auto px-14 py-6">
                            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            
            {/* Input pill for active chats (bottom anchored) */}
            {messages.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                    <div className="max-w-3xl mx-auto pointer-events-auto relative">
                        <form onSubmit={handleSubmit} className="input-island relative flex items-center p-3 gap-3">
                            <input 
                                placeholder="Follow up..." value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="bg-transparent border-none py-2 px-3 text-base outline-none text-[var(--text-primary)] placeholder-zinc-500 flex-1"
                            />
                            <div className="flex items-center gap-2 pr-1">
                                <button onClick={toggleVoice} type="button" className={`p-2.5 rounded-2xl ${isListening ? 'text-red-400 bg-red-400/10' : 'text-zinc-400 hover:text-[var(--accent)]'}`}><Mic size={20} /></button>
                                <button type="submit" className="p-2.5 bg-[var(--accent)] text-white rounded-2xl"><Send size={20} /></button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
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
    
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [artifact, setArtifact] = useState({ isOpen: false, title: '', content: '', language: '' });
    const [user, setUser] = useState(null);

    // Sync theme with root element
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

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
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-center p-6">
                <div className="w-40 h-40 mb-12 animate-float">
                    <img src="./logo.png" alt="Maurya AI Logo" className="w-full h-full rounded-[2.5rem] shadow-[0_20px_60px_rgba(255,96,0,0.15)] border border-zinc-50" />
                </div>
                <h1 className="text-5xl font-black text-[#1a1a1a] mb-6 tracking-tight">Maurya AI <span className="text-[#ff6000]">Pro</span></h1>
                <p className="text-zinc-500 max-w-sm mb-14 leading-relaxed text-xl">Your high-performance, private workspace for professional AI collaboration.</p>
                <button 
                    onClick={handleLogin}
                    className="px-16 py-5 bg-[#ff6000] text-white rounded-[1.5rem] font-black hover:bg-[#e65600] transition-all active:scale-95 shadow-[0_15px_40px_rgba(255,96,0,0.4)] text-xl uppercase tracking-widest"
                >
                    Sign In to Maurya AI
                </button>
            </div>
        );
    }

    const userInitials = user.user_metadata?.full_name?.split(' ').map(n => n[0]).join('') || user.email[0].toUpperCase();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0b] font-sans text-zinc-100 relative">
            <MobileHeader />
            <Sidebar 
                onNewChat={startNewChat} 
                user={user}
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                onLogout={handleLogout}
                history={history}
                onLoadSession={loadSession}
                onDeleteSession={deleteSession}
                currentSessionId={currentSessionId}
            />
            
            <div className="flex-1 flex overflow-hidden">
                <main className={`flex-1 flex flex-col relative overflow-hidden h-full sidebar-transition ${artifact.isOpen ? 'opacity-80 scale-[0.99] origin-left' : ''}`}>
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
