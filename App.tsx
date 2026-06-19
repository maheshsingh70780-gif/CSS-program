import { useState, useEffect } from 'react';
import { INITIAL_TRACKS, INITIAL_USER } from './data';
import { SkillTrack, UserProfile } from './types';
import TopAppBar from './components/TopAppBar';
import BottomNavBar from './components/BottomNavBar';
import FeedTab from './components/FeedTab';
import CreateTab from './components/CreateTab';
import ProfileTab from './components/ProfileTab';

export default function App() {
  // Navigation active state
  const [currentTab, setCurrentTab] = useState<'feed' | 'create' | 'profile'>('feed');

  // Search state managed globally to filter real-time tracks
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Core persisted states
  const [tracks, setTracks] = useState<SkillTrack[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Initialize from LocalStorage or Data.ts on first mounting loader
  useEffect(() => {
    const savedTracks = localStorage.getItem('thiranex_tracks');
    const savedUser = localStorage.getItem('thiranex_user');

    if (savedTracks) {
      try {
        setTracks(JSON.parse(savedTracks));
      } catch (e) {
        setTracks(INITIAL_TRACKS);
      }
    } else {
      setTracks(INITIAL_TRACKS);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(INITIAL_USER);
      }
    } else {
      setUser(INITIAL_USER);
    }
  }, []);

  // Sync to localStorage whenever states change
  useEffect(() => {
    if (tracks.length > 0) {
      localStorage.setItem('thiranex_tracks', JSON.stringify(tracks));
    }
  }, [tracks]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('thiranex_user', JSON.stringify(user));
    }
  }, [user]);

  // Handle syncing state back to defaults
  function handleResetDefaultTracks() {
    const confirmed = window.confirm("Are you sure you want to reset all tracks, XP points, and submissions back to initial platform defaults?");
    if (confirmed) {
      setTracks(INITIAL_TRACKS);
      setUser(INITIAL_USER);
      localStorage.setItem('thiranex_tracks', JSON.stringify(INITIAL_TRACKS));
      localStorage.setItem('thiranex_user', JSON.stringify(INITIAL_USER));
      setSearchQuery('');
      setShowSearchBar(false);
      setCurrentTab('feed');
    }
  }

  // Handle custom track additions
  function handleAddTrack(newTrack: SkillTrack) {
    const nextTrackIndex = tracks.length + 1;
    const trackWithNumber = {
      ...newTrack,
      trackNumber: nextTrackIndex
    };
    const updated = [trackWithNumber, ...tracks];
    setTracks(updated);
    
    // Automatically swap tab view straight to Feed so developers see their deployment
    setTimeout(() => {
      setCurrentTab('feed');
    }, 1500);
  }

  // Handle updating a single track
  function handleUpdateTrack(updatedTrack: SkillTrack) {
    const updated = tracks.map(t => {
      if (t.id === updatedTrack.id) return updatedTrack;
      // If we completed track 4 (Blog Platform), unlock the microservices track!
      if (updatedTrack.id === 'track-4' && updatedTrack.status === 'COMPLETED' && t.id === 'track-microservices') {
        return {
          ...t,
          status: 'AVAILABLE' as const
        };
      }
      return t;
    });

    setTracks(updated);
  }

  // Handle updating user profile variables
  function handleUpdateUser(updatedUser: UserProfile) {
    setUser(updatedUser);
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb] text-sm font-semibold text-[#434655]">
        Launching Thiranex Environment...
      </div>
    );
  }

  return (
    <div 
      className="bg-background text-on-surface min-h-screen pb-24 text-sm font-sans flex flex-col antialiased"
      style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, #e2e8f0 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}
      id="thiranex-root-app"
    >
      {/* Fixed top Header Appbar */}
      <TopAppBar 
        onReset={handleResetDefaultTracks}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearchBar={showSearchBar}
        setShowSearchBar={setShowSearchBar}
      />

      {/* Main Container Stage */}
      <main className="flex-1 pt-24 px-4 max-w-2xl mx-auto w-full">
        
        {/* Render Feed Welcome Heading only if on feed tab */}
        {currentTab === 'feed' && (
          <section className="mb-8 text-center md:text-left space-y-1" id="feed-welcome-section">
            <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-[#191c1e] tracking-tight">
              Build Your Future
            </h1>
            <p className="text-[#434655] text-sm leading-relaxed">
              Explore hands-on skill tracks and master modern technology through building.
            </p>
          </section>
        )}

        {/* Dynamic Tab Switchers Rendering */}
        <div className="pb-8">
          {currentTab === 'feed' && (
            <FeedTab 
              tracks={tracks}
              onUpdateTrack={handleUpdateTrack}
              user={user}
              onUpdateUser={handleUpdateUser}
              searchQuery={searchQuery}
            />
          )}

          {currentTab === 'create' && (
            <CreateTab 
              onAddTrack={handleAddTrack}
              userName={user.name}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileTab 
              user={user}
              tracks={tracks}
              onUpdateUser={handleUpdateUser}
            />
          )}
        </div>

        {/* Footer Credit Tagline */}
        <footer className="mt-12 text-center pb-8 opacity-65 flex flex-col items-center gap-1 select-none">
          <span className="font-mono text-[10px] text-[#737686]">
            System developed and maintained by Team Emogi (emogi.in)
          </span>
          <span className="text-[10px] text-slate-400 font-sans">
            Thiranex Platform Beta V3.4.1 (UTC 2026)
          </span>
        </footer>
      </main>

      {/* Floating Bottom Nav Controller (supports instant layout swapping) */}
      <BottomNavBar 
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          // clear search overlay if jumping tab to prevent confusion
          if (tab !== 'feed') {
            setSearchQuery('');
          }
        }}
      />
    </div>
  );
}
