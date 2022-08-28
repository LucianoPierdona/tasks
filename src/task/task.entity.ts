import { Base } from '../common/entities/base.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TaskStatus {
  TO_DO = 'To do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
  ARCHIVED = 'Archived',
}

@Entity('tasks')
export class Task extends Base {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: TaskStatus })
  status: TaskStatus;
}
