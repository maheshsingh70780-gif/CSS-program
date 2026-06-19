export interface KeyFeature {
  id: string;
  text: string;
}

export type TrackStatus = 'AVAILABLE' | 'LOCKED' | 'COMPLETED' | 'SUBMITTED';

export interface SkillTrack {
  id: string;
  trackNumber?: number; // e.g., 4
  title: string;
  description: string;
  category: string;
  status: TrackStatus;
  dueDate?: string; // e.g., "29 Jun 2026"
  daysLeft?: number;
  imageUrl?: string;
  keyFeatures?: string[];
  expectedOutcome?: string;
  author?: {
    name: string;
    avatarInitials: string;
    avatarUrl?: string;
  };
  contentMarkdown?: string; // Content for "Read More"
  submissionDetails?: {
    repoUrl: string;
    demoUrl?: string;
    notes?: string;
    submittedAt: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  bio: string;
  xp: number;
  completedCount: number;
  streakDays: number;
  joinedDate: string;
  skills: { name: string; level: number; color: string }[];
}
