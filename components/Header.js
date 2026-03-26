const { Key, X } = lucide;

const Header = ({ apiKey, onApiKeyChange, showInput, onCloseInput }) => {
    return (
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <span className="bg-gradient-to-tr from-zinc-200 to-zinc-500 text-zinc-950 p-1.5 rounded-lg font-bold text-[10px] tracking-tighter">PRO</span>
                <h1 className="font-semibold text-zinc-200 tracking-tight text-sm">Agent Artifact</h1>
            </div>
            
            {showInput ? (
                <div className="flex items-center gap-2 max-w-sm w-full animate-in slide-in-from-top-2 duration-300">
                    <input 
                        type="password" 
                        placeholder="Anthropic API Key..."
                        value={apiKey}
                        onChange={(e) => onApiKeyChange(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 focus:border-zinc-700 outline-none rounded-lg py-1.5 px-3 text-xs flex-1 text-zinc-100 transition-all placeholder:text-zinc-600 shadow-inner"
                    />
                    <button 
                        onClick={onCloseInput}
                        className="bg-zinc-200 hover:bg-white text-zinc-950 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors active:scale-95 flex items-center justify-center p-2"
                    >
                        Save
                    </button>
                    <button onClick={onCloseInput} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-zinc-800">
                        <div className={`w-1.5 h-1.5 rounded-full ${apiKey ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                            {apiKey ? 'API Connected' : 'No API Key'}
                        </span>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
