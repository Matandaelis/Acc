export interface Project {
  id: string;
  title: string;
  type: 'thesis' | 'dissertation' | 'paper';
  description: string;
  lastModified: number;
  content: string;
  outline: OutlineItem[];
  status: 'draft' | 'review' | 'published';
  progress: number;
}

export interface OutlineItem {
  id: string;
  title: string;
  level: number; // 1 for H1, 2 for H2, etc.
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
