import { Task, TaskStatus } from '../task.entity';

export class TaskRespDto {
  id: number;

  title: string;

  description: string;

  status: TaskStatus;

  constructor({ id, title, description, status }: Partial<Task>) {
    Object.assign(this, {
      id,
      title,
      description,
      status,
    });
  }
}
