export interface Task {
  id: string;
  text: string;
  deadline?: string;
  isCompleted: boolean;
  goalId?: string;
}

export interface Goal {
  id: string;
  text: string;
}
