const { Plus, History, Trash2, Key, ChevronLeft } = lucide;
const { useState } = React;

const Sidebar = ({ history, currentSessionId, onNewChat, onLoadSession, onDeleteSession, onToggleAPI }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-800 rounded-lg border border-zinc-700"
            >
                {isOpen ? <lucide.X size={20} /> : <lucide.Menu size={20} />}
            </button>

            <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                    <button 
                        onClick={onNewChat}
                        className="flex-1 h-11 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-xl border border-zinc-700 transition-all active:scale-95"
                    >
                        <Plus size={18} /> New Chat
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                    {history.length === 0 && (
                        <div className="text-zinc-500 text-center py-10 px-4">
                            <History size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-xs">No conversations yet</p>
                        </div>
                    )}
                    {history.map(session => (
                        <div 
                            key={session.id}
                            onClick={() => {
                                onLoadSession(session);
                                if (window.innerWidth < 768) setIsOpen(false);
                            }}
                            className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${currentSessionId === session.id ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'}`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <History size={16} className="shrink-0" />
                                <span className="text-sm truncate font-medium">{session.title}</span>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteSession(session.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <button 
                        onClick={onToggleAPI}
                        className="flex items-center gap-3 text-zinc-500 hover:text-zinc-200 text-sm transition-colors py-2 px-1 w-full"
                    >
                        <Key size={16} /> API Settings
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
