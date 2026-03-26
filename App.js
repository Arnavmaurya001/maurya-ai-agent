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
            parameters: {
                type: "OBJECT",
                properties: {
                    path: { type: "STRING", description: "The path to the file to read" }
                },
                required: ["path"]
            }
        },
        {
            name: "write_file",
            description: "Write content to a file in the virtual filesystem.",
            parameters: {
                type: "OBJECT",
                properties: {
                    path: { type: "STRING", description: "The path where the file should be saved" },
                    content: { type: "STRING", description: "The content to write to the file" }
                },
                required: ["path", "content"]
            }
        },
        {
            name: "web_search",
            description: "Perform a web search using the specified query.",
            parameters: {
                type: "OBJECT",
                properties: {
                    query: { type: "STRING", description: "The search query" }
                },
                required: ["query"]
            }
        }
    ]
};

const callGemini = async (apiKey, contents, systemPrompt) => {
    try {
        const response = await fetch('/api/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: contents,
                tools: [GEMINI_TOOLS]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Failed to call Gemini API through local proxy');
        }

        return await response.json();
    } catch (err) {
        throw err;
    }
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
    // PRE-SET THE USER'S KEY
    const [apiKey, setApiKeyState] = useState(() => localStorage.getItem('gemini_api_key') || 'AIzaSyB1zVEjuu9Ksweu6w58LyeCj8JtEDs1_jU');
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('chat_history');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);

    const setApiKey = (val) => {
        setApiKeyState(val);
        localStorage.setItem('gemini_api_key', val);
    };

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
                    const readRes = await fetch('/api/files/read', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: args.path })
                    });
                    if (!readRes.ok) {
                        const err = await readRes.json();
                        return `Error: ${err.error?.message || 'Failed to read file'}`;
                    }
                    const readData = await readRes.json();
                    return readData.content;
                case 'write_file':
                    const writeRes = await fetch('/api/files/write', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: args.path, content: args.content })
                    });
                    if (!writeRes.ok) {
                        const err = await writeRes.json();
                        return `Error: ${err.error?.message || 'Failed to write file'}`;
                    }
                    return `Successfully wrote to '${args.path}'`;
                case 'web_search':
                    const searchRes = await fetch('/api/search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: args.query })
                    });
                    if (!searchRes.ok) {
                        const err = await searchRes.json();
                        return `Error: ${err.error?.message || 'Failed to perform search'}`;
                    }
                    const searchData = await searchRes.json();
                    return Array.isArray(searchData.results) ? searchData.results.join('\n') : "No results found.";
                default:
                    return "Unknown tool";
            }
        } catch (err) {
            return `Error: ${err.message}`;
        }
    };

    const sendMessage = async (input) => {
        if (!input.trim() || !apiKey) return;

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
                const response = await callGemini(apiKey, geminiContents, "You are Maurya AI, a precise coding assistant using the virtual filesystem. Reason step by step before acting. Be concise and professional.");
                
                const candidate = response.candidates[0];
                const modelParts = candidate.content.parts;
                
                // Map Gemini parts to our app structure
                const assistantMsg = { 
                    role: 'model', 
                    content: modelParts.map(p => {
                        if (p.text) return { type: 'text', text: p.text };
                        if (p.functionCall) {
                            // Generate a stable ID for this tool call to link it to its result
                            const toolId = p.functionCall.name + "_" + Math.random().toString(36).substr(2, 9);
                            return { type: 'tool_use', name: p.functionCall.name, input: p.functionCall.args, id: toolId };
                        }
                        return null;
                    }).filter(Boolean)
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
        messages, isThinking, history, currentSessionId, apiKey, setApiKey, sendMessage, 
        startNewChat, loadSession, deleteSession, showApiKeyInput, setShowApiKeyInput
    };
};

/**
 * 
 * CORE COMPONENTS
 * 
 */

const Sidebar = ({ history, currentSessionId, onNewChat, onLoadSession, onDeleteSession, onToggleAPI }) => {
    return (
        <aside className="fixed inset-y-0 left-0 z-40 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col md:relative">
            <div className="p-4 border-b border-zinc-800">
                <button 
                    onClick={onNewChat}
                    className="w-full h-11 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-xl border border-zinc-700 transition-all active:scale-95 text-white"
                >
                    <Plus size={18} /> New Chat
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                {history.map(session => (
                    <div 
                        key={session.id}
                        onClick={() => onLoadSession(session)}
                        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${currentSessionId === session.id ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'}`}
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

            <div className="p-4 border-t border-zinc-800">
                <button onClick={onToggleAPI} className="flex items-center gap-3 text-zinc-500 hover:text-zinc-200 text-sm w-full py-2">
                    <Key size={16} /> API Settings
                </button>
            </div>
        </aside>
    );
};

const Markdown = ({ content }) => {
    const html = useMemo(() => marked.parse(content || ""), [content]);
    useEffect(() => { if (window.Prism) window.Prism.highlightAll(); }, [html]);
    return <div className="prose prose-invert prose-sm max-w-none text-zinc-300 space-y-4" dangerouslySetInnerHTML={{ __html: html }} />;
};

const ToolCall = ({ toolCall, result }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="my-3 border border-zinc-800 bg-zinc-900/40 rounded-xl overflow-hidden shadow-sm">
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between p-3 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="bg-zinc-800 p-1.5 rounded-lg text-zinc-400"><Code size={14} /></div>
                    <span className="text-sm font-medium text-zinc-300">{toolCall.name}</span>
                </div>
                {result ? <Bot size={14} className="text-zinc-600" /> : <Loader2 size={14} className="animate-spin text-zinc-600" />}
            </button>
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-800/50 bg-zinc-950/30">
                    <pre className="text-[10px] text-zinc-500 overflow-x-auto mt-2 p-2 bg-black/20 rounded">
                        {JSON.stringify(toolCall.input, null, 2)}
                    </pre>
                    {result && <div className="mt-2 text-xs text-sky-400 border-t border-zinc-800/20 pt-2">{result}</div>}
                </div>
            )}
        </div>
    );
};

const Message = ({ msg }) => {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex gap-5 px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[90%] ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${isUser ? 'bg-zinc-800 border-zinc-700' : 'bg-transparent border-zinc-800'}`}>
                    {isUser ? <User size={16} /> : <Bot size={16} className="text-zinc-400" />}
                </div>
                <div className={`overflow-x-auto ${isUser ? 'bg-zinc-800/80 p-4 rounded-2xl text-zinc-200' : ''}`}>
                    {Array.isArray(msg.content) ? (
                        msg.content.map((block, idx) => {
                            if (block.type === 'text') return <Markdown key={idx} content={block.text} />;
                            if (block.type === 'tool_use') return <ToolCall key={idx} toolCall={block} result={msg.toolResults?.[block.id]} />;
                            return null;
                        })
                    ) : (
                        <Markdown content={msg.content} />
                    )}
                </div>
            </div>
        </div>
    );
};

const Chat = ({ messages, isThinking, apiKey, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isThinking]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isThinking || !apiKey) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-10">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-60">
                            <Bot size={32} className="mb-4 text-zinc-500" />
                            <h2 className="text-xl font-semibold text-zinc-300">Maurya AI is ready. What shall we build?</h2>
                        </div>
                    )}
                    {messages.map((msg, i) => <Message key={i} msg={msg} />)}
                    {isThinking && <Loader2 size={16} className="animate-spin text-zinc-600 ml-12" />}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="p-6 border-t border-zinc-900 bg-zinc-950/50">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
                    <input 
                        placeholder="Type a message..." value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-4 pr-14 text-sm outline-none text-white"
                    />
                    <button type="submit" disabled={!input.trim() || isThinking || !apiKey} className="absolute right-3 bottom-3 p-2 bg-zinc-200 text-zinc-950 rounded-xl hover:bg-white transition-all">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

const Header = ({ apiKey, onApiKeyChange, showInput, onCloseInput }) => {
    return (
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-md">
            <h1 className="font-semibold text-zinc-200">Maurya AI Agent (Gemini)</h1>
            {showInput ? (
                <div className="flex items-center gap-2">
                    <input 
                        type="password" value={apiKey} placeholder="Gemini API Key..."
                        onChange={(e) => onApiKeyChange(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 rounded-lg py-1 px-3 text-xs outline-none text-white"
                    />
                    <button onClick={onCloseInput} className="bg-zinc-200 text-zinc-950 px-3 py-1 rounded-lg text-xs font-bold">Save</button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]' : 'bg-red-500'}`} />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{apiKey ? 'Gemini Active' : 'No API Key'}</span>
                </div>
            )}
        </header>
    );
};

const App = () => {
    const { 
        messages, isThinking, history, currentSessionId, apiKey, setApiKey, 
        sendMessage, startNewChat, loadSession, deleteSession, showApiKeyInput, setShowApiKeyInput 
    } = useAgent();

    return (
        <div className="flex h-screen w-full overflow-hidden bg-zinc-950 font-sans text-zinc-100">
            <Sidebar history={history} currentSessionId={currentSessionId} onNewChat={startNewChat} onLoadSession={loadSession} onDeleteSession={deleteSession} onToggleAPI={() => setShowApiKeyInput(!showApiKeyInput)} />
            <main className="flex-1 flex flex-col relative overflow-hidden h-full">
                <Header apiKey={apiKey} onApiKeyChange={setApiKey} showInput={showApiKeyInput} onCloseInput={() => setShowApiKeyInput(false)} />
                <Chat messages={messages} isThinking={isThinking} apiKey={apiKey} onSendMessage={sendMessage} />
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
