import Message from './Message.js';
const { useState, useRef, useEffect } = React;
const { Send, Bot, User, Loader2 } = lucide;

const Chat = ({ messages, isThinking, apiKey, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isThinking]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isThinking || !apiKey) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Scrollable area */}
            <div className="flex-1 overflow-y-auto px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-10">
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-60">
                            <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800 shadow-xl">
                                <Bot size={32} className="text-zinc-400" />
                            </div>
                            <h2 className="text-2xl font-semibold mb-2 text-zinc-200">How can I help you code today?</h2>
                            <p className="text-zinc-500 max-w-xs text-sm">I can read/write files and execute multi-step logic autonomously.</p>
                        </div>
                    )}
                    
                    {messages.map((msg, i) => (
                        <Message key={i} msg={msg} />
                    ))}
                    
                    {isThinking && (
                        <div className="flex gap-4 px-2">
                            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border border-zinc-800 animate-pulse bg-zinc-900/50">
                                <Bot size={16} className="text-zinc-600" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Claude</span>
                                <div className="flex items-center gap-3 text-zinc-500 bg-zinc-900/30 p-4 rounded-2xl animate-pulse">
                                    <div className="flex space-x-1">
                                        <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1 h-1 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span className="text-xs font-medium italic">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input area */}
            <div className="p-6 border-t border-zinc-900 bg-zinc-950/50">
                <div className="max-w-3xl mx-auto relative group">
                    <form onSubmit={handleSubmit} className="relative">
                        <textarea 
                            rows="1"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 rounded-2xl py-4 pl-4 pr-14 text-sm text-zinc-100 outline-none transition-all resize-none shadow-2xl placeholder:text-zinc-600 group-hover:border-zinc-700 min-h-[56px] max-h-60"
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isThinking || !apiKey}
                            className="absolute right-3 bottom-3 p-2 bg-zinc-200 hover:bg-white text-zinc-950 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    {!apiKey && (
                        <p className="text-[10px] text-zinc-600 mt-2 text-center uppercase tracking-widest font-bold">
                            Please configure your Anthropic API key to begin.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
