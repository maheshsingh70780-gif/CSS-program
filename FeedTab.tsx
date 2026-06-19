import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  Code, 
  ChevronRight, 
  Trophy, 
  Server, 
  AlertCircle, 
  Play, 
  Layers, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { SkillTrack, UserProfile } from '../types';

interface FeedTabProps {
  tracks: SkillTrack[];
  onUpdateTrack: (updated: SkillTrack) => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  searchQuery: string;
}

export default function FeedTab({ 
  tracks, 
  onUpdateTrack, 
  user, 
  onUpdateUser, 
  searchQuery 
}: FeedTabProps) {
  // Navigation states inside feed
  const [selectedTrackForRead, setSelectedTrackForRead] = useState<SkillTrack | null>(null);
  const [selectedTrackForSubmit, setSelectedTrackForSubmit] = useState<SkillTrack | null>(null);
  
  // Submission form states
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitStep, setSubmitStep] = useState<'idle' | 'analyzing' | 'compiling' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Interactive Grid Sandbox states (used in the "Read More" drawer for CSS Grid track)
  const [gridCols, setGridCols] = useState<number>(3);
  const [gridGap, setGridGap] = useState<string>('gap-4');
  const [activeLayout, setActiveLayout] = useState<'normal' | 'sidebar' | 'bento'>('normal');
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizAnswer, setQuizAnswer] = useState<string>('');
  const [quizError, setQuizError] = useState<string>('');

  // Filtering based on search query
  const filteredTracks = tracks.filter(track => {
    const q = searchQuery.toLowerCase();
    return (
      track.title.toLowerCase().includes(q) ||
      track.description.toLowerCase().includes(q) ||
      track.category.toLowerCase().includes(q) ||
      (track.keyFeatures && track.keyFeatures.some(f => f.toLowerCase().includes(q)))
    );
  });

  // Handle work submission trigger
  function handleInitSubmit(track: SkillTrack) {
    if (track.status === 'LOCKED') {
      alert("This track is locked! Complete the prerequisite 'Blog Platform' track first.");
      return;
    }
    setRepoUrl(track.submissionDetails?.repoUrl || 'https://github.com/maheshsingh70780/blog-platform');
    setDemoUrl(track.submissionDetails?.demoUrl || 'https://thiranex-blog.netlify.app');
    setNotes(track.submissionDetails?.notes || '');
    setErrorMessage('');
    setSubmitStep('idle');
    setSelectedTrackForSubmit(track);
  }

  // Handle actual server-mock validation and submission flow
  function executeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!repoUrl.trim()) {
      setErrorMessage('GitHub Repository URL is required.');
      return;
    }
    if (!repoUrl.startsWith('https://github.com/')) {
      setErrorMessage('Please provide a valid GitHub repository URL (starts with https://github.com/).');
      return;
    }

    setErrorMessage('');
    setSubmitStep('analyzing');

    // Simulate realistic multi-step submission validation flow
    setTimeout(() => {
      setSubmitStep('compiling');
      setTimeout(() => {
        setSubmitStep('success');
        
        // Update track details
        if (selectedTrackForSubmit) {
          const isFirstTimeCompletion = selectedTrackForSubmit.status !== 'COMPLETED';
          const updatedTrack: SkillTrack = {
            ...selectedTrackForSubmit,
            status: 'COMPLETED',
            submissionDetails: {
              repoUrl,
              demoUrl,
              notes,
              submittedAt: new Date().toISOString()
            }
          };
          onUpdateTrack(updatedTrack);

          // If first time completed, award XP and increment completion count
          if (isFirstTimeCompletion) {
            const extraXp = 250;
            const updatedUser: UserProfile = {
              ...user,
              xp: user.xp + extraXp,
              completedCount: user.completedCount + 1,
              streakDays: user.streakDays + 1
            };
            onUpdateUser(updatedUser);
          }
        }
      }, 1500);
    }, 1500);
  }

  // Handle mini CSS Grid activity success
  function handleCompleteGridTask() {
    if (quizAnswer.toLowerCase().trim() === 'grid-template-areas') {
      setQuizCompleted(true);
      setQuizError('');
      
      // Update CSS Grid Track to COMPLETED if not already
      const gridTrack = tracks.find(t => t.id === 'track-grid');
      if (gridTrack && gridTrack.status !== 'COMPLETED') {
        const updatedGrid: SkillTrack = {
          ...gridTrack,
          status: 'COMPLETED'
        };
        onUpdateTrack(updatedGrid);
        
        const updatedUser: UserProfile = {
          ...user,
          xp: user.xp + 150,
          completedCount: user.completedCount + 1
        };
        onUpdateUser(updatedUser);
      }
    } else {
      setQuizError('Incorrect. Hint: Look at the template naming property in CSS Grid (uses double-quotes block maps).');
    }
  }

  return (
    <div className="space-y-8" id="feed-container">
      
      {/* Search results banner if searching */}
      {searchQuery && (
        <div className="bg-[#dae2fd]/50 border border-[#b4c5ff] px-4 py-3 rounded-xl flex items-center justify-between" id="search-banner">
          <p className="text-sm font-sans text-[#5c647a]">
            Showing <span className="font-bold text-[#004ac6]">{filteredTracks.length}</span> results matching "<span className="italic">{searchQuery}</span>"
          </p>
          <span className="text-xs font-mono bg-[#004ac6] text-white px-2 py-0.5 rounded-full">Filtered</span>
        </div>
      )}

      {filteredTracks.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white border border-[#c3c6d7] rounded-xl space-y-4" id="empty-search-state">
          <AlertCircle className="h-12 w-12 text-[#737686] mx-auto opacity-60" />
          <h3 className="font-headline font-bold text-lg text-[#191c1e]">No Search Results Found</h3>
          <p className="text-sm text-[#434655] max-w-sm mx-auto">
            We couldn't find any skill tracks matching "{searchQuery}". Try refining your search query or reset the filter.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTracks.map((track) => {
            const isLock = track.status === 'LOCKED';
            const isCompleted = track.status === 'COMPLETED';

            return (
              <article 
                key={track.id} 
                className={`border border-[#c3c6d7] rounded-xl overflow-hidden shadow-sm transition-all duration-300 md:hover:-translate-y-1 md:hover:shadow-md ${
                  isLock 
                    ? 'bg-[#f2f4f6]/60 opacity-75' 
                    : isCompleted 
                    ? 'bg-white border-green-200' 
                    : 'bg-white'
                }`}
                id={`track-card-${track.id}`}
              >
                {/* Hero Image section for visual tracking card (e.g., CSS Grid) */}
                {track.imageUrl && (
                  <div className="h-48 relative overflow-hidden" id={`card-image-box-${track.id}`}>
                    <img 
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 hover:scale-105" 
                      src={track.imageUrl} 
                      alt={track.title}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="font-mono text-xs font-semibold bg-[#2563eb] text-white px-2.5 py-1 rounded-md uppercase tracking-wider">
                        NEW SKILL
                      </span>
                      {isCompleted && (
                        <span className="font-mono text-xs font-semibold bg-green-600 text-white px-2.5 py-1 rounded-md flex items-center gap-1 shadow">
                          <CheckCircle2 className="h-3 w-3" /> MASTERED
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Card Wrapper Padding */}
                <div className="p-6">
                  {/* Top Badging Row */}
                  <div className="flex justify-between items-center mb-4">
                    {/* Track Number / Icon Box */}
                    <div className="flex items-center gap-3">
                      {track.trackNumber ? (
                        <div className="bg-[#eceef0] text-[#004ac6] font-headline font-bold text-lg w-10 h-10 rounded-lg flex items-center justify-center">
                          {track.trackNumber}
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLock ? 'bg-[#eceef0] text-[#737686]' : 'bg-[#dae2fd] text-[#004ac6]'}`}>
                          {isLock ? <Lock className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
                        </div>
                      )}
                      
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] font-bold text-[#565e74] uppercase tracking-wider">
                          {track.category}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill Badge */}
                    <div>
                      {isLock ? (
                        <span className="font-mono font-bold text-[11px] text-[#737686] bg-[#eceef0] border border-[#c3c6d7] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <Lock className="h-3 w-3" /> LOCKED
                        </span>
                      ) : isCompleted ? (
                        <span className="font-mono font-bold text-[11px] text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3 fill-green-100" /> COMPLETED
                        </span>
                      ) : (
                        <span className="font-mono font-bold text-[11px] text-[#2563eb] bg-[#dae2fd] border border-[#b4c5ff] px-2.5 py-1 rounded-full tracking-wider">
                          AVAILABLE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Due date if available */}
                  {!isLock && track.dueDate && (
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4 p-2 bg-[#f2f4f6] rounded-lg">
                      <div className="flex items-center gap-1.5 text-xs text-[#434655]">
                        <Calendar className="h-4 w-4 text-[#737686]" />
                        <span>Due Date: <strong className="text-[#191c1e]">{track.dueDate}</strong></span>
                      </div>
                      {track.daysLeft && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[11px] font-semibold">
                          <Clock className="h-3 w-3" />
                          <span>{track.daysLeft} Days Left</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Partition Divider line if applicable */}
                  {!track.imageUrl && <div className="border-t border-dashed border-[#c3c6d7] my-4"></div>}

                  {/* Title & Description */}
                  <h2 className="font-headline font-bold text-xl md:text-2xl text-[#191c1e] my-2 hover:text-[#004ac6] transition-colors leading-snug">
                    {track.title}
                  </h2>
                  <p className="text-sm text-[#434655] leading-relaxed mb-5">
                    {track.description}
                  </p>

                  {/* Core Key Features list if available */}
                  {!isLock && track.keyFeatures && (
                    <div className="space-y-3 mb-5 p-4 rounded-xl bg-slate-50/50 border border-slate-200">
                      <h3 className="text-xs font-bold text-[#004ac6] uppercase tracking-wider flex items-center gap-1">
                        <Code className="h-3.5 w-3.5" /> Key Features
                      </h3>
                      <ul className="space-y-2 text-sm text-[#434655]">
                        {track.keyFeatures.map((feat, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] mt-2 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Expected Outcomes, if available */}
                  {!isLock && track.expectedOutcome && (
                    <div className="mb-6">
                      <h3 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1.5">
                        Expected Outcome:
                      </h3>
                      <p className="text-xs text-[#434655] leading-relaxed bg-green-50/50 p-2.5 rounded-lg border border-green-100 italic">
                        {track.expectedOutcome}
                      </p>
                    </div>
                  )}

                  {/* Bottom Author Credentials & Submit section */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mt-6 pt-4 border-t border-[#eceef0]">
                    {/* Author block */}
                    {track.author && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#dae2fd] text-[#004ac6] font-bold text-xs flex items-center justify-center border-2 border-[#b4c5ff]">
                          {track.author.avatarInitials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] text-[#737686] font-mono leading-none">Curated by</span>
                          <span className="text-xs font-bold text-[#191c1e]">{track.author.name}</span>
                        </div>
                      </div>
                    )}

                    {/* Operational Action CTA */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      {track.contentMarkdown && (
                        <button
                          onClick={() => setSelectedTrackForRead(track)}
                          className="flex items-center justify-center gap-1 px-4 py-2 border border-[#c3c6d7] hover:border-[#004ac6] hover:text-[#004ac6] text-xs font-semibold rounded-lg bg-white active:bg-slate-50 transition-colors w-full sm:w-auto"
                        >
                          Read Guide
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}

                      {!isLock && (
                        <button
                          onClick={() => handleInitSubmit(track)}
                          className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 font-sans font-bold text-xs rounded-lg active:scale-95 transition-all shadow-sm ${
                            isCompleted 
                              ? 'bg-green-600 hover:bg-green-700 text-white' 
                              : 'bg-[#2563eb] hover:bg-[#004ac6] text-white'
                          }`}
                        >
                          {isCompleted ? 'Review Submission' : 'Submit Work'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* READ MORE GUIDE MODAL (with fully interactive CSS grid layout playground!) */}
      {selectedTrackForRead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#c3c6d7] flex flex-col">
            <div className="p-4 border-b border-[#eceef0] flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-[#dae2fd] text-[#004ac6] px-2 py-0.5 rounded uppercase">
                  {selectedTrackForRead.category}
                </span>
                <span className="text-xs text-[#737686]">Guides & Exercises</span>
              </div>
              <button 
                onClick={() => {
                  setSelectedTrackForRead(null);
                  setQuizCompleted(false);
                  setQuizAnswer('');
                  setQuizError('');
                }}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-[#434655]" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              <div className="space-y-2">
                <h2 className="font-headline font-extrabold text-2xl text-[#191c1e]">{selectedTrackForRead.title}</h2>
                <div className="flex items-center gap-2 text-xs text-[#565e74]">
                  <span>Instructor: <strong className="text-[#191c1e]">{selectedTrackForRead.author?.name}</strong></span>
                  <span>•</span>
                  <span>Interactive sandbox included</span>
                </div>
              </div>

              {/* Guide Contents */}
              <div className="prose prose-slate text-sm max-w-none text-[#434655] leading-relaxed space-y-4 bg-slate-50 p-4 rounded-xl border border-[#eceef0]">
                <p className="font-bold text-[#191c1e] text-base">Grid Layout Architectures Course</p>
                <p>
                  CSS Grid allows you to build complex multi-device structures without floats, positioning hacks, or bulky CSS framework helper rules. It defines columns, rows, and margins elegantly.
                </p>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto space-y-1">
                  <div><span className="text-pink-400">#workbench</span> &#123;</div>
                  <div className="pl-4"><span className="text-[#b4c5ff]">display</span>: <span className="text-green-300">grid</span>;</div>
                  <div className="pl-4"><span className="text-[#b4c5ff]">grid-template-columns</span>: <span className="text-sky-300">repeat(3, 1fr)</span>;</div>
                  <div className="pl-4"><span className="text-[#b4c5ff]">grid-gap</span>: <span className="text-[#b4c5ff]">16px</span>;</div>
                  <div>&#125;</div>
                </div>
              </div>

              {/* LIVE INTERACTIVE CSS GRID SANDBOX */}
              <div className="border border-[#b4c5ff] rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="bg-[#dae2fd] text-[#004ac6] border-b border-[#b4c5ff] px-4 py-3 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
                    <Code className="h-4 w-4" /> CSS Grid Playable Workbench Sandbox
                  </div>
                  <span className="bg-[#2563eb] text-white text-[10px] font-mono px-2 py-0.5 rounded-full">Interactive</span>
                </div>

                <div className="p-4 space-y-4">
                  {/* Controls row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Columns slider */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#565e74] flex justify-between">
                        <span>Columns Grid:</span>
                        <span className="text-[#004ac6] font-mono font-bold">{gridCols} columns</span>
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="4" 
                        value={gridCols} 
                        onChange={(e) => setGridCols(parseInt(e.target.value))} 
                        className="w-full h-1.5 bg-[#eceef0] rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
                      />
                    </div>

                    {/* Gap selectors */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#565e74]">Grid Gap (Spacing):</label>
                      <div className="grid grid-cols-3 gap-1">
                        {['gap-1', 'gap-4', 'gap-8'].map((gapOption) => (
                          <button
                            key={gapOption}
                            onClick={() => setGridGap(gapOption)}
                            className={`px-2 py-1 text-xs font-mono rounded ${
                              gridGap === gapOption 
                                ? 'bg-[#004ac6] text-white font-bold' 
                                : 'bg-[#f2f4f6] text-[#434655] hover:bg-[#e0e3e5]'
                            }`}
                          >
                            {gapOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Layout template */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#565e74]">Layout Style Preset:</label>
                      <select 
                        value={activeLayout}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setActiveLayout(val);
                          if (val === 'sidebar') setGridCols(3);
                        }}
                        className="w-full text-xs bg-[#f2f4f6] border border-[#c3c6d7] rounded p-1 text-[#191c1e] font-sans"
                      >
                        <option value="normal">Equal Grid Blocks</option>
                        <option value="sidebar">Sidebar Map Area (colspan)</option>
                        <option value="bento">Bento Portfolio Mix</option>
                      </select>
                    </div>
                  </div>

                  {/* Renderable Sandbox output stage */}
                  <div className="border border-dashed border-[#c3c6d7] p-3 rounded-lg bg-dots bg-[#f7f9fb]">
                    <div 
                      className={`grid ${gridGap}`}
                      style={{
                        gridTemplateColumns: activeLayout === 'normal' 
                          ? `repeat(${gridCols}, minmax(0, 1fr))` 
                          : activeLayout === 'sidebar'
                          ? '1fr 2fr' 
                          : 'repeat(4, minmax(0, 1fr))'
                      }}
                    >
                      {activeLayout === 'normal' && Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-[#dae2fd] border-2 border-[#004ac6] rounded-lg p-3 text-center transition-all duration-300">
                          <span className="font-mono text-xs font-bold text-[#004ac6]">Item {i + 1}</span>
                        </div>
                      ))}

                      {activeLayout === 'sidebar' && (
                        <>
                          <div className="bg-[#eaddff] border-2 border-[#6a1edb] rounded-lg p-3 text-center col-span-2">
                            <span className="font-mono text-xs font-bold text-[#6a1edb]">Header Block</span>
                          </div>
                          <div className="bg-[#dae2fd] border-2 border-[#004ac6] rounded-lg p-4 text-center">
                            <span className="font-mono text-xs font-bold text-[#004ac6]">Sidebar Nav</span>
                          </div>
                          <div className="bg-slate-100 border-2 border-[#737686] rounded-lg p-8 text-center">
                            <span className="font-mono text-xs font-bold text-[#191c1e]">Main Workspace Content</span>
                          </div>
                          <div className="bg-[#eceef0] border-2 border-[#565e74] rounded-lg p-2 text-center col-span-2">
                            <span className="font-mono text-xs font-bold text-[#2d3133]">Footer block</span>
                          </div>
                        </>
                      )}

                      {activeLayout === 'bento' && (
                        <>
                          <div className="bg-[#dae2fd] border-2 border-[#004ac6] rounded-lg p-4 text-center col-span-2 row-span-2 flex flex-col justify-center">
                            <span className="font-mono text-xs font-bold text-[#004ac6]">Bento Large feature</span>
                          </div>
                          <div className="bg-amber-50 border-2 border-amber-500 rounded-lg p-3 text-center">
                            <span className="font-mono text-xs font-bold text-amber-700">Analytics widget</span>
                          </div>
                          <div className="bg-[#eaddff] border-2 border-[#6a1edb] rounded-lg p-3 text-center">
                            <span className="font-mono text-xs font-bold text-[#6a1edb]">Tag cloud</span>
                          </div>
                          <div className="bg-green-50 border-2 border-green-600 rounded-lg p-3 text-center col-span-2">
                            <span className="font-mono text-xs font-bold text-green-700">Sub-task checker</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification challenge exercise */}
              <div className="border border-green-200 bg-green-50/50 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-green-800">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <h4 className="font-headline font-bold text-sm">Prerequisite Verification Challenge</h4>
                </div>
                <p className="text-xs text-green-800 leading-relaxed">
                  To complete this course, fill in the answer of the CSS property that allows template layouts via words (e.g., "header sidebar content").
                  <br />
                  <strong>Question:</strong> Name the property for custom template grid names mapping?
                </p>

                {quizCompleted ? (
                  <div className="flex items-center gap-2 p-3 bg-green-100 text-green-800 border border-green-300 rounded-lg" id="quiz-success">
                    <Check className="h-5 w-5 text-green-600 font-bold" />
                    <div>
                      <p className="font-bold text-xs">Exemplary! Skill challenge solved!</p>
                      <p className="text-[11px] text-green-700">You unlocked this course, gained <strong>+150 XP</strong>, and status is updated.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type property (e.g. grid-template-areas)" 
                        value={quizAnswer}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-green-200 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      <button 
                        onClick={handleCompleteGridTask}
                        className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-sans font-bold text-xs rounded shadow-sm hover:shadow"
                      >
                        Verify Skill
                      </button>
                    </div>
                    {quizError && <p className="text-[11px] text-[#ba1a1a]">{quizError}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-[#eceef0] bg-[#f7f9fb] flex justify-end">
              <button 
                onClick={() => {
                  setSelectedTrackForRead(null);
                  setQuizCompleted(false);
                  setQuizAnswer('');
                  setQuizError('');
                }}
                className="px-5 py-2 bg-slate-950 hover:bg-slate-800 text-white font-sans text-xs font-bold rounded-lg"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL / DIALOG CABINET */}
      {selectedTrackForSubmit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-[#c3c6d7] flex flex-col overflow-hidden">
            
            {/* Header info */}
            <div className="p-4 border-b border-[#eceef0] bg-[#dae2fd] text-[#004ac6] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Code className="h-5 w-5" />
                <span className="font-headline font-bold text-sm">Submit Work - Workspace Integration</span>
              </div>
              <button 
                onClick={() => setSelectedTrackForSubmit(null)}
                className="p-1 rounded-full hover:bg-black/5 text-[#004ac6]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="font-headline font-extrabold text-[#191c1e] text-lg mb-2">
                {selectedTrackForSubmit.title}
              </h3>
              <p className="text-xs text-[#565e74] mb-4">
                Submit your local workspace project link. Your files will be securely evaluated against our automatic linting parameters.
              </p>

              {submitStep === 'idle' ? (
                <form onSubmit={executeSubmit} className="space-y-4">
                  {/* Repo URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#191c1e] flex justify-between">
                      <span>GitHub Repository URL: <span className="text-[#ba1a1a]">*</span></span>
                      <span className="font-normal text-[#737686] text-[10px]">(Must start with https://github.com/)</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g., https://github.com/maheshsingh70780/blog" 
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full text-xs h-10 px-3 border border-[#c3c6d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                      required
                    />
                  </div>

                  {/* Demo URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#191c1e]">Live Deployment URL (Optional):</label>
                    <input 
                      type="text" 
                      placeholder="e.g., https://blog-platform.vercel.app" 
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      className="w-full text-xs h-10 px-3 border border-[#c3c6d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    />
                  </div>

                  {/* Student Remarks / Notes */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#191c1e]">Developer Notes & Architecture details:</label>
                    <textarea 
                      placeholder="Briefly state your technology choices, state management libraries used, and any extra feature credits..." 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-xs p-3 border border-[#c3c6d7] rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#ba1a1a] text-xs font-semibold rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <div className="pt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTrackForSubmit(null)}
                      className="flex-1 py-2.5 border border-[#c3c6d7] text-[#434655] font-sans font-bold text-xs rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#2563eb] text-white font-sans font-bold text-xs rounded-lg hover:bg-[#004ac6] transition-colors"
                    >
                      Verify & Submit Track
                    </button>
                  </div>
                </form>
              ) : submitStep === 'analyzing' ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4" id="submit-step-analyzing">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
                    <Code className="absolute top-5 left-5 h-6 w-6 text-[#2563eb] animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-bold text-sm text-[#191c1e]">Analyzing Repository Branch...</p>
                    <p className="text-xs text-[#565e74]">Authenticating developer credentials with Thiranex API keys...</p>
                  </div>
                </div>
              ) : submitStep === 'compiling' ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4" id="submit-step-compiling">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <Layers className="absolute top-5 left-5 h-6 w-6 text-green-600 animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-bold text-sm text-[#191c1e]">Compiling Fullstack Modules...</p>
                    <p className="text-xs text-[#565e74]">Executing server health tests & schema validations...</p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-6" id="submit-step-success">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto border-2 border-green-200">
                    <CheckCircle2 className="h-10 w-10 text-green-600 fill-green-50" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-headline font-extrabold text-[#191c1e] text-xl">Submission Completed Successfully!</h4>
                    <p className="text-xs text-[#434655] max-w-sm mx-auto">
                      Congratulations! Your repository was compiled with active checks. You earned <strong>+250 XP</strong> and advanced your progress track.
                    </p>
                  </div>

                  <div className="bg-dots bg-[#f7f9fb] p-4 rounded-xl border border-[#c3c6d7] text-left space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#737686]">Repository:</span>
                      <span className="font-bold text-[#191c1e] text-ellipsis overflow-hidden max-w-[200px]">{repoUrl}</span>
                    </div>
                    {demoUrl && (
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#737686]">Live Link:</span>
                        <span className="font-bold text-[#004ac6] flex items-center gap-1">{demoUrl} <ExternalLink className="h-3 w-3" /></span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#737686]">Status:</span>
                      <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">Verified</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedTrackForSubmit(null);
                      setSubmitStep('idle');
                    }}
                    className="w-full py-3 bg-[#191c1e] text-white hover:bg-slate-800 font-sans font-bold text-xs rounded-lg"
                  >
                    Return to Feed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
