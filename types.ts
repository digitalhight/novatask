
export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
  activeProjectId: string | null;
}
