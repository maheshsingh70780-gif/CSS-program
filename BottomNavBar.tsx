import { Rss, PlusCircle, User } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: 'feed' | 'create' | 'profile';
  onTabChange: (tab: 'feed' | 'create' | 'profile') => void;
}

export default function BottomNavBar({ currentTab, onTabChange }: BottomNavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#f7f9fb]/90 backdrop-blur-md border-t border-[#c3c6d7] shadow-lg">
      <div className="flex justify-around items-center h-16 pb-safe max-w-lg mx-auto px-4">
        {/* Feed Tab */}
        <button
          onClick={() => onTabChange('feed')}
          className={`flex flex-col items-center justify-center py-1 px-5 rounded-xl active:scale-95 transition-all outline-none ${
            currentTab === 'feed'
              ? 'text-[#004ac6] bg-[#dae2fd] font-bold'
              : 'text-[#565e74] hover:text-[#004ac6]'
          }`}
          id="nav-tab-feed"
        >
          <Rss className="h-5 w-5 mb-0.5" />
          <span className="font-sans text-xs">Feed</span>
        </button>

        {/* Create Tab */}
        <button
          onClick={() => onTabChange('create')}
          className={`flex flex-col items-center justify-center py-1 px-5 rounded-xl active:scale-95 transition-all outline-none ${
            currentTab === 'create'
              ? 'text-[#004ac6] bg-[#dae2fd] font-bold'
              : 'text-[#565e74] hover:text-[#004ac6]'
          }`}
          id="nav-tab-create"
        >
          <PlusCircle className="h-5 w-5 mb-0.5" />
          <span className="font-sans text-xs">Create</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center py-1 px-5 rounded-xl active:scale-95 transition-all outline-none ${
            currentTab === 'profile'
              ? 'text-[#004ac6] bg-[#dae2fd] font-bold'
              : 'text-[#565e74] hover:text-[#004ac6]'
          }`}
          id="nav-tab-profile"
        >
          <User className="h-5 w-5 mb-0.5" />
          <span className="font-sans text-xs">Profile</span>
        </button>
      </div>
    </nav>
  );
}
