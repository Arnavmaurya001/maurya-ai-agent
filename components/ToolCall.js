const { FileText, Save, Globe, Code, ChevronRight, ChevronDown, Loader2 } = lucide;
const { useState } = React;

const ToolCall = ({ toolCall, result }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const toolIcons = {
        read_file: <FileText size={14} />,
        write_file: <Save size={14} />,
        web_search: <Globe size={14} />,
        call_api: <Code size={14} />,
    };

    const status = result ? 'done' : 'thinking';

    return (
        <div className="my-3 border border-zinc-800 bg-zinc-900/40 rounded-xl overflow-hidden transition-all group-hover:border-zinc-700">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-800/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 border border-white/5">
                        {toolIcons[toolCall.name] || <lucide.Search size={14} />}
                    </div>
                    <div className="text-left">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 leading-none mb-1">Tool Execute</span>
                        <h4 className="text-sm font-medium text-zinc-300">{toolCall.name}</h4>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {status === 'thinking' && <Loader2 size={14} className="animate-spin text-zinc-500" />}
                    {isExpanded ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
                </div>
            </button>
            
            {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-800/50 bg-zinc-950/30 animate-in slide-in-from-top-2 duration-200">
                    <div className="pt-4 space-y-4">
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Arguments</span>
                            <pre className="bg-zinc-900/80 p-3 rounded-lg text-xs text-emerald-400 overflow-x-auto border border-white/5 font-mono shadow-inner">
                                {JSON.stringify(toolCall.input, null, 2)}
                            </pre>
                        </div>
                        {result && (
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Result</span>
                                <pre className="bg-zinc-900/80 p-3 rounded-lg text-xs text-sky-400 overflow-x-auto border border-white/5 whitespace-pre-wrap font-mono shadow-inner">
                                    {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolCall;
