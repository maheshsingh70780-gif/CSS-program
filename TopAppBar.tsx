import { Terminal, Search, RotateCw, Sparkles, X } from 'lucide-react';

interface TopAppBarProps {
  onReset: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchBar: boolean;
  setShowSearchBar: (show: boolean) => void;
}

export default function TopAppBar({
  onReset,
  searchQuery,
  setSearchQuery,
  showSearchBar,
  setShowSearchBar
}: TopAppBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/85 backdrop-blur-md border-b border-[#c3c6d7] transition-all">
      <div className="flex items-center justify-between px-4 md:px-6 max-w-7xl mx-auto h-16">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => {
            setShowSearchBar(false);
            setSearchQuery('');
          }}
          className="flex items-center gap-2 cursor-pointer active:opacity-80 group"
          id="brand-logo-container"
        >
          <div className="bg-[#004ac6] text-white p-1.5 rounded-lg group-hover:bg-[#2563eb] transition-colors">
            <Terminal className="h-5 w-5" />
          </div>
          <span className="font-headline font-extrabold text-2xl tracking-tight text-[#004ac6] select-none">
            Thiranex
          </span>
        </div>

        {/* Dynamic Center Search Bar */}
        {showSearchBar && (
          <div className="flex-1 max-w-sm mx-4 relative" id="search-bar-inner">
            <input
              type="text"
              placeholder="Search skill tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-8 rounded-lg border border-[#c3c6d7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#434655]" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3"
              >
                <X className="h-4 w-4 text-[#434655] hover:text-[#004ac6]" />
              </button>
            )}
          </div>
        )}

        {/* Actions Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => {
              setShowSearchBar(!showSearchBar);
              if (showSearchBar) setSearchQuery('');
            }}
            className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 active:bg-black/10 transition-colors ${showSearchBar ? 'bg-black/5 text-[#004ac6]' : 'text-[#434655]'}`}
            title="Toggle Search"
            id="toggle-search-btn"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Active Track Notification */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#eceef0] rounded-full border border-[#c3c6d7]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004ac6] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#004ac6]"></span>
            </span>
            <span className="font-mono text-xs font-semibold text-[#434655]">
              Active track
            </span>
          </div>

          {/* Refresh/Reset Button */}
          <button
            onClick={onReset}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 active:rotate-180 transition-all duration-300 text-[#434655]"
            title="Reset to defaults"
            id="reset-tracks-btn"
          >
            <RotateCw className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
