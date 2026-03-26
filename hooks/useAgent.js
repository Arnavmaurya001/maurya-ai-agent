import { callAnthropic } from '../api/anthropic.js';

const { useState, useEffect, useCallback } = React;

export const useAgent = () => {
    const [apiKey, setApiKeyState] = useState(() => localStorage.getItem('anthropic_api_key') || '');
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
        localStorage.setItem('anthropic_api_key', val);
    };

    const saveSession = useCallback((msgs) => {
        if (msgs.length === 0) return;
        const sessionId = currentSessionId || Date.now().toString();
        setCurrentSessionId(sessionId);
        
        const updatedHistory = [...history];
        const index = updatedHistory.findIndex(h => h.id === sessionId);
        
        const sessionSummary = {
            id: sessionId,
            title: msgs[0]?.content?.substring(0, 30) + (msgs[0]?.content?.length > 30 ? '...' : ''),
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
        // Mock Tool Logic
        switch (name) {
            case 'read_file':
                const fs = JSON.parse(localStorage.getItem('virtual_fs') || '{}');
                return fs[args.path] || `Error: File '${args.path}' not found.`;
            case 'write_file':
                const currentFs = JSON.parse(localStorage.getItem('virtual_fs') || '{}');
                currentFs[args.path] = args.content;
                localStorage.setItem('virtual_fs', JSON.stringify(currentFs));
                return `Successfully wrote to '${args.path}'`;
            case 'web_search':
                return `Search results for "${args.query}":\n1. Result about ${args.query}...\n2. Another insight into ${args.query}...\n(Note: This is a simulation of search results)`;
            case 'call_api':
                try {
                    const response = await fetch(args.url, {
                        method: args.method || 'GET',
                        body: args.body ? args.body : undefined,
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const data = await response.text();
                    return data.substring(0, 1000); // Truncate
                } catch (err) {
                    return `Error calling API: ${err.message}`;
                }
            default:
                return "Unknown tool";
        }
    };

    const sendMessage = async (input) => {
        if (!input.trim() || !apiKey) return;

        const userMsg = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setIsThinking(true);

        let conversationHistory = [...newMessages];

        try {
            let agentStillWorking = true;
            
            while (agentStillWorking) {
                const response = await callAnthropic(apiKey, conversationHistory, "You are a precise coding assistant like Pi. Reason step by step before acting. Be concise and professional.");
                
                const assistantMsg = { 
                    role: 'assistant', 
                    content: response.content 
                };
                
                const hasToolUse = response.content.some(c => c.type === 'tool_use');
                
                if (!hasToolUse) {
                    setMessages(prev => [...prev, assistantMsg]);
                    saveSession([...newMessages, assistantMsg]);
                    agentStillWorking = false;
                } else {
                    const toolMessages = [];
                    const updatedMessages = [...conversationHistory, assistantMsg];
                    
                    setMessages(prev => [...prev, assistantMsg]);

                    for (const block of response.content) {
                        if (block.type === 'tool_use') {
                            const result = await executeTool(block.name, block.input);
                            toolMessages.push({
                                role: 'user',
                                content: [
                                    {
                                        type: 'tool_result',
                                        tool_use_id: block.id,
                                        content: result
                                    }
                                ]
                            });
                            
                            setMessages(prev => {
                                const last = prev[prev.length - 1];
                                if (last.role === 'assistant') {
                                    return [...prev.slice(0, -1), { 
                                        ...last, 
                                        toolResults: { ...(last.toolResults || {}), [block.id]: result } 
                                    }];
                                }
                                return prev;
                            });
                        }
                    }
                    
                    conversationHistory = [...updatedMessages, ...toolMessages];
                }
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: `**Error:** ${err.message}` }]);
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
        messages,
        isThinking,
        history,
        currentSessionId,
        apiKey,
        setApiKey,
        sendMessage,
        startNewChat,
        loadSession,
        deleteSession,
        showApiKeyInput,
        setShowApiKeyInput
    };
};
