import ToolCall from './ToolCall.js';
const { User, Bot } = lucide;
const { useMemo, useEffect } = React;

const Markdown = ({ content }) => {
    const html = useMemo(() => {
        if (!content) return "";
        return marked.parse(content);
    }, [content]);

    useEffect(() => {
        Prism.highlightAll();
    }, [html]);

    return (
        <div 
            className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

const Message = ({ msg }) => {
    const isUser = msg.role === 'user';
    
    return (
        <div className={`flex gap-5 px-2 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
            <div className={`flex gap-4 max-w-[90%] md:max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${isUser ? 'bg-zinc-800 border-zinc-700' : 'bg-transparent border-zinc-800'}`}>
                    {isUser ? <User size={16} /> : <Bot size={16} className="text-zinc-400" />}
                </div>
                <div className="flex flex-col gap-1.5 overflow-hidden">
                    <span className={`text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1 ${isUser ? 'text-right' : ''}`}>
                        {isUser ? 'You' : 'Claude'}
                    </span>
                    <div className={`overflow-x-auto ${isUser ? 'bg-zinc-800/80 p-4 rounded-2xl rounded-tr-none text-zinc-200 text-sm' : ''}`}>
                        {Array.isArray(msg.content) ? (
                            msg.content.map((block, idx) => {
                                if (block.type === 'text') return <Markdown key={idx} content={block.text} />;
                                if (block.type === 'tool_use') return (
                                    <ToolCall 
                                        key={idx} 
                                        toolCall={block} 
                                        result={msg.toolResults?.[block.id]}
                                    />
                                );
                                return null;
                            })
                        ) : (
                            <Markdown content={msg.content} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
