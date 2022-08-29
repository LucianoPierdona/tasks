import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { UserService } from '../user/user.service';
import { FindManyOptions, Repository } from 'typeorm';
import { PaginationReqDto } from '../common/dto/pagination-req.dto';
import { PaginationRespDto } from '../common/dto/pagination-resp.dto';
import { ErrorMessages } from '../common/error-messages';
import { CreateTaskReqDto } from './dto/create-task-req.dto';
import { TaskRespDto } from './dto/task-resp.dto';
import { UpdateTaskReqDto } from './dto/update-task-req.dto';
import { Task, TaskStatus } from './task.entity';
import { UserRole } from '../user/user.entity';
import { AuthRespDto } from '../auth/dto/auth-resp.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  async create(
    { description, title, status }: CreateTaskReqDto,
    user: AuthRespDto,
  ): Promise<TaskRespDto> {
    const savedUser = await this.userService.findOne({
      where: {
        id: user.id,
      },
    });

    if (!savedUser) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }

    const task = new Task();

    task.title = title;
    task.description = description;
    task.status = status || TaskStatus.TO_DO;
    task.user = savedUser;

    await this.taskRepository.save(task);

    return new TaskRespDto(task);
  }

  async update(
    id: number,
    { description, title, status }: UpdateTaskReqDto,
    user: AuthRespDto,
  ): Promise<TaskRespDto> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

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
    user,
  }: PaginationReqDto): Promise<PaginationRespDto<TaskRespDto>> {
    const userQuery = this.mountUserTaskQuery(user);

    const [tasks, total] = await Promise.all([
      this.taskRepository.find({
        take: limit,
        skip: limit * page,
        order: {
          createdAt: 'ASC',
        },
        ...userQuery,
      }),
      this.taskRepository.count({
        ...userQuery,
      }),
    ]);

    return {
      records: tasks.map((task) => new TaskRespDto(task)),
      total,
      page,
      limit,
    };
  }

  async get(id: number, user: AuthRespDto): Promise<TaskRespDto> {
    const userQuery = this.mountUserTaskQuery(user);

    if (userQuery.where) {
      Object.assign(userQuery.where, {
        id,
      });
    } else {
      userQuery.where = {
        id,
      };
    }

    const task = await this.taskRepository.findOne(userQuery);

    if (!task) {
      throw new NotFoundException(ErrorMessages.TASK_NOT_FOUND);
    }

    return new TaskRespDto(task);
  }

  private mountUserTaskQuery(user: AuthRespDto): FindManyOptions<Task> {
    return user.role === UserRole.USER ? { where: { userId: user.id } } : {};
  }
}
