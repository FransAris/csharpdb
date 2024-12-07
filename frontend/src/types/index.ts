export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskState;
  isCompleted: boolean;
  lastModified?: string;
  labelId?: number;
  label?: Label;
}

export enum TaskState {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface Label {
  id: number;
  name: string;
  color: string;
  description?: string;
}

export interface Column {
  title: string;
  tasks: Task[];
}

export interface TaskBoardProps {
  labelId: string | null;
}

export interface TasksData {
  tasks: {
    nodes: Task[];
  };
}

export interface LabelsData {
  labels: {
    nodes: Label[];
  };
} 