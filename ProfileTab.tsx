import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  MapPin, 
  Mail, 
  Calendar, 
  Github, 
  ExternalLink, 
  History, 
  ChevronRight, 
  Zap, 
  Sparkles,
  CheckCircle2,
  Code
} from 'lucide-react';
import { UserProfile, SkillTrack } from '../types';

interface ProfileTabProps {
  user: UserProfile;
  tracks: SkillTrack[];
  onUpdateUser: (updated: UserProfile) => void;
}

export default function ProfileTab({ user, tracks, onUpdateUser }: ProfileTabProps) {
  const [streakClaimed, setStreakClaimed] = useState(false);
  const [showRankTip, setShowRankTip] = useState(false);

  // Filter out tracks that are marked as COMPLETED by the user
  const completedTracks = tracks.filter(t => t.status === 'COMPLETED');

  // Calculate dynamic statistics
  const totalXP = user.xp;
  const rank = totalXP >= 1500 ? 'Architect Legend' : totalXP >= 1200 ? 'Fullstack Orchestrator' : 'Skill Apprentice';

  // Claim Daily active developer streak helper
  function handleClaimStreak() {
    if (streakClaimed) return;
    setStreakClaimed(true);
    
    const updatedUser = {
      ...user,
      streakDays: user.streakDays + 1,
      xp: user.xp + 50
    };
    onUpdateUser(updatedUser);
  }

  // Interactive Level Up Skill helper (costs 100 XP to level up a skill inside the prototype)
  function handleUpgradeSkill(skillName: string) {
    if (user.xp < 100) {
      alert("Requires at least 100 XP developer points to level up a skill!");
      return;
    }

    const updatedSkills = user.skills.map(s => {
      if (s.name === skillName) {
        return { ...s, level: Math.min(s.level + 5, 100) };
      }
      return s;
    });

    const updatedUser = {
      ...user,
      xp: user.xp - 100,
      skills: updatedSkills
    };
    onUpdateUser(updatedUser);
  }

  return (
    <div className="space-y-6" id="profile-pane">
      
      {/* Primary User Hero Header Card */}
      <div className="bg-white border border-[#c3c6d7] rounded-xl overflow-hidden shadow-sm p-6 relative">
        <div className="absolute top-4 right-4 animate-bounce">
          <Sparkles className="h-6 w-6 text-[#7c3aed]" />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Avatar frame with high contrast colored rings */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-[#7c3aed] flex items-center justify-center font-headline text-white text-3xl font-bold font-sans">
              MS
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full text-white p-1.5 shadow" title="Top Contributor">
              <Trophy className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
              <h2 className="font-headline font-bold text-2xl text-[#191c1e]">{user.name}</h2>
              <span 
                onClick={() => setShowRankTip(!showRankTip)}
                className="bg-[#dae2fd] text-[#004ac6] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full select-none cursor-pointer border border-[#b4c5ff] hover:bg-[#b4c5ff]"
              >
                {rank}
              </span>
            </div>

            <p className="text-sm text-[#434655] leading-relaxed max-w-md">{user.bio}</p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2 text-xs text-[#565e74] font-medium">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-[#737686]" /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[#737686]" /> Joined {user.joinedDate}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#737686]" /> Remote Workbench
              </span>
            </div>
          </div>
        </div>

        {showRankTip && (
          <div className="mt-4 p-3 bg-[#eaddff] text-[#25005a] border border-[#d2bbff] rounded-lg text-xs" id="rank-explanation">
            <strong>Developer Tier Rank Guide:</strong> You are currently a <span className="font-bold">{rank}</span>. Complete more cards on the Feed to gain XP. Reaching 1500 XP unlocks <em>Architect Legend</em>!
          </div>
        )}
      </div>

      {/* Stats Dash Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="profile-stats-grid">
        
        {/* Total XP tracker */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#737686] uppercase">Dev Point XP</span>
            <p className="text-3xl font-headline font-extrabold text-[#004ac6]">{totalXP}</p>
          </div>
          <div className="w-12 h-12 bg-[#dae2fd] rounded-lg flex items-center justify-center text-[#004ac6]">
            <Zap className="h-6 w-6" />
          </div>
        </div>

        {/* Tracks completed */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#737686] uppercase">Tracks Finished</span>
            <p className="text-3xl font-headline font-extrabold text-green-700">{completedTracks.length} / {tracks.length}</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-700 border border-green-100">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Daily Streak with interactive trigger */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#737686] uppercase">Daily Streak</span>
              <p className="text-2xl font-headline font-extrabold text-orange-600">{user.streakDays} Days</p>
            </div>
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 border border-orange-100 animate-pulse">
              <Flame className="h-5.5 w-5.5 fill-orange-50" />
            </div>
          </div>
          <button
            onClick={handleClaimStreak}
            disabled={streakClaimed}
            className={`w-full py-1 text-[11px] font-sans font-bold uppercase rounded transition-all ${
              streakClaimed 
                ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed border border-emerald-200' 
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
            }`}
          >
            {streakClaimed ? '✓ Claimed Today (+50 XP)' : '⚡ Daily developer log in check-in'}
          </button>
        </div>
      </div>

      {/* Lower Double Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        
        {/* Left: Dynamic interactive skills drawer */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#eceef0] pb-2">
            <h3 className="font-headline font-bold text-base text-[#191c1e] flex items-center gap-1.5">
              <Award className="h-5 w-5 text-[#004ac6]" /> Language Mastery
            </h3>
            <span className="text-[10px] font-mono bg-[#eceef0] text-[#565e74] px-2 py-0.5 rounded">Interactive Upgrades</span>
          </div>

          <p className="text-xs text-[#565e74] leading-relaxed">
            Spend <strong>100 XP</strong> to upgrade developer skills and gain proficiency stats within your career path.
          </p>

          <div className="space-y-4 pt-1">
            {user.skills.map((skill) => (
              <div key={skill.name} className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#191c1e]">{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#565e74]">{skill.level}%</span>
                    <button
                      onClick={() => handleUpgradeSkill(skill.name)}
                      className="px-1.5 py-0.5 bg-slate-100 hover:bg-[#b4c5ff] hover:text-[#004ac6] border border-[#c3c6d7] rounded text-[10px] font-bold"
                      title="Spend 100 XP to upgrade (+5% level)"
                    >
                      + Up
                    </button>
                  </div>
                </div>
                {/* Progress tracker bar */}
                <div className="h-2 bg-[#eceef0] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: skill.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Submission logs History */}
        <div className="bg-white border border-[#c3c6d7] rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-headline font-bold text-base text-[#191c1e] border-b border-[#eceef0] pb-2 flex items-center gap-1.5">
            <History className="h-5 w-5 text-green-700" /> Compiled Work Archives ({completedTracks.length})
          </h3>

          {completedTracks.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#737686] space-y-2">
              <History className="h-8 w-8 mx-auto stroke-1" />
              <p>No compiled submissions archived yet.</p>
              <p className="text-[11px] italic">Go back to the Feed and submit an active track!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {completedTracks.map((comp) => (
                <div key={comp.id} className="p-3 bg-slate-50 rounded-lg border border-[#c3c6d7] text-xs space-y-2">
                  <div className="flex gap-1 items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-[#004ac6]">
                        {comp.category}
                      </span>
                      <h4 className="font-bold text-[#191c1e] text-sm leading-tight">{comp.title}</h4>
                    </div>
                    <span className="font-mono text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded shrink-0">
                      VERIFIED
                    </span>
                  </div>

                  {comp.submissionDetails && (
                    <div className="space-y-1 pt-1 border-t border-dashed border-[#c3c6d7] text-[11px] text-[#434655]">
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <Github className="h-3 w-3" />
                        <a 
                          href={comp.submissionDetails.repoUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:underline text-[#2563eb] text-ellipsis overflow-hidden max-w-[190px]"
                        >
                          {comp.submissionDetails.repoUrl}
                        </a>
                      </div>
                      
                      {comp.submissionDetails.demoUrl && (
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <ExternalLink className="h-3 w-3" />
                          <a 
                            href={comp.submissionDetails.demoUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="hover:underline text-green-700"
                          >
                            {comp.submissionDetails.demoUrl}
                          </a>
                        </div>
                      )}

                      {comp.submissionDetails.notes && (
                        <p className="italic text-[#737686] mt-1 bg-white p-1.5 rounded border border-slate-100">
                          "{comp.submissionDetails.notes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
