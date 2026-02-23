export type JobStatus = 'Applied' | 'Interviewed' | 'Offered' | 'Rejected';

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  applicationDate: string;
  status: JobStatus;
  followUpDate?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface JobStats {
  total: number;
  applied: number;
  interviewed: number;
  offered: number;
  rejected: number;
  successRate: number;
}

export interface Reminder {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  followUpDate: string;
  notified: boolean;
}

export const statusColors: Record<JobStatus, { bg: string; text: string; border: string }> = {
  Applied: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    border: 'border-blue-400/30'
  },
  Interviewed: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-300',
    border: 'border-amber-400/30'
  },
  Offered: {
    bg: 'bg-green-500/20',
    text: 'text-green-300',
    border: 'border-green-400/30'
  },
  Rejected: {
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    border: 'border-red-400/30'
  }
};

export const statusIcons: Record<JobStatus, string> = {
  Applied: '✉️',
  Interviewed: '🤝',
  Offered: '🎉',
  Rejected: '❌'
};
