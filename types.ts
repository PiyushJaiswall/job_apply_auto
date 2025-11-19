export enum ApplicationStatus {
  QUEUED = 'QUEUED',
  ANALYZING = 'ANALYZING',
  TAILORING = 'TAILORING',
  PREFILLING = 'PREFILLING',
  APPLIED = 'APPLIED',
  REJECTED = 'REJECTED',
  INTERVIEW = 'INTERVIEW'
}

export interface Project {
  id: string;
  title: string;
  techStack: string[];
  description: string[]; // Array of bullet points
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  objective: string;
  skills: string[];
  experience: string[];
  education: string[];
  projects: Project[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  url: string;
  source: string;
  postedDate: string;
  matchScore?: number;
  requiredSkills?: string[];
  status: ApplicationStatus;
}

export interface TailoredResume {
  jobId: string;
  originalProfileId: string;
  rewrittenObjective: string;
  selectedProjectIds: string[];
  rewrittenProjectDescriptions: Record<string, string[]>; // ProjectID -> New Bullets
  extractedKeywords: string[];
  matchAnalysis: string;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  service: 'MATCHING' | 'TAILORING' | 'TRACKING';
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}