import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { PaginationReqDto } from '../common/dto/pagination-req.dto';
import { PaginationRespDto } from '../common/dto/pagination-resp.dto';
import { ErrorMessages } from '../common/error-messages';
import { CreateTaskReqDto } from './dto/create-task-req.dto';
import { TaskRespDto } from './dto/task-resp.dto';
import { UpdateTaskReqDto } from './dto/update-task-req.dto';
import { Task, TaskStatus } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create({
    description,
    title,
    status,
  }: CreateTaskReqDto): Promise<TaskRespDto> {
    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = status || TaskStatus.TO_DO;

    await this.taskRepository.save(task);

    return new TaskRespDto(task);
  }

  async update(
    id: number,
    { description, title, status }: UpdateTaskReqDto,
  ): Promise<TaskRespDto> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException(ErrorMessages.TASK_NOT_FOUND);
    }

    Object.assign(task, {
      ...(description && { description }),
      ...(title && { title }),
      ...(status && { status }),
    });

    await this.taskRepository.save(task);

    return new TaskRespDto(task);
  }

  async list({
    limit = 10,
    page = 0,
  }: PaginationReqDto): Promise<PaginationRespDto<TaskRespDto>> {
    const [tasks, total] = await Promise.all([
      this.taskRepository.find({
        take: limit,
        skip: limit * page,
        order: {
          createdAt: 'ASC',
        },
      }),
      this.taskRepository.count({}),
    ]);

    return {
      records: tasks.map((task) => new TaskRespDto(task)),
      total,
      page,
      limit,
    };
  }

  async get(id: number): Promise<TaskRespDto> {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return new TaskRespDto(task);
  }
}
