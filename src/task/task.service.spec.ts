import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { AuthRespDto } from '../auth/dto/auth-resp.dto';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { TaskService } from './task.service';
import { UserRole } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ErrorMessages } from '../common/error-messages';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository;
  let userService;

  const user: AuthRespDto = {
    email: 'email',
    id: 1,
    role: UserRole.ADMIN,
  };

  class MockPinoLogger {}
  class MockUserService {
    async findOne() {
      return null;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PinoLogger,
          useClass: MockPinoLogger,
        },
        {
          provide: UserService,
          useClass: MockUserService,
        },
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(taskRepository).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('get', () => {
    it('should return a task', async () => {
      const task = {
        id: 1,
        title: 'title',
        description: 'description',
        status: TaskStatus.IN_PROGRESS,
      };

      const taskFindOneSpy = jest
        .spyOn(taskRepository, 'findOne')
        .mockResolvedValue(task);

      const result = await service.get(task.id, user);

      expect(result).toEqual(task);
      expect(taskFindOneSpy).toHaveBeenCalledTimes(1);
      expect(taskFindOneSpy).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
      });
    });

    it('should throw an error when a task is not found', async () => {
      const task = {
        id: 1,
      };

      const taskFindOneSpy = jest
        .spyOn(taskRepository, 'findOne')
        .mockResolvedValue(null);

      let response;
      let error;

      try {
        response = await service.get(task.id, user);
      } catch (err) {
        error = err;
      }

      expect(response).toEqual(undefined);

      expect(error instanceof NotFoundException).toBeTruthy();
      expect(error.status).toEqual(404);
      expect(error.message).toEqual('Task not found');

      expect(taskFindOneSpy).toHaveBeenCalledTimes(1);
      expect(taskFindOneSpy).toHaveBeenCalledWith({
        where: {
          id: task.id,
        },
      });
    });
  });

  describe('list', () => {
    it('should return a list of tasks', async () => {
      const task = {
        id: 1,
        title: 'title',
        description: 'description',
        status: TaskStatus.IN_PROGRESS,
      };

      const taskFindSpy = jest
        .spyOn(taskRepository, 'find')
        .mockResolvedValue([task]);

      const taskCountSpy = jest
        .spyOn(taskRepository, 'count')
        .mockResolvedValue(1);

      const result = await service.list({
        limit: 10,
        page: 0,
        user,
      });

      expect(result).toEqual({ records: [task], total: 1, page: 0, limit: 10 });

      expect(taskFindSpy).toHaveBeenCalledTimes(1);
      expect(taskFindSpy).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        order: {
          createdAt: 'ASC',
        },
      });

      expect(taskCountSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a task', async () => {
      const task = {
        title: 'title',
        description: 'description',
        status: TaskStatus.IN_PROGRESS,
      };

      const userFindOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(user);

      const taskSaveSpy = jest
        .spyOn(taskRepository, 'save')
        .mockResolvedValue(true);

      const result = await service.create(
        {
          description: task.description,
          title: task.title,
          status: task.status,
        },
        user,
      );

      expect(result).toEqual(task);

      expect(userFindOneSpy).toHaveBeenCalledTimes(1);
      expect(userFindOneSpy).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });

      expect(taskSaveSpy).toHaveBeenCalledTimes(1);
      expect(taskSaveSpy).toHaveBeenCalledWith({
        ...task,
        user,
      });
    });

    it('should throw an error when an user is not found', async () => {
      const task = {
        title: 'title',
        description: 'description',
        status: TaskStatus.IN_PROGRESS,
      };

      const userFindOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(null);

      const taskSaveSpy = jest.spyOn(taskRepository, 'save');

      let response;
      let error;

      try {
        response = await service.create(
          {
            description: task.description,
            title: task.title,
            status: task.status,
          },
          user,
        );
      } catch (err) {
        error = err;
      }

      expect(response).toEqual(undefined);

      expect(error instanceof NotFoundException).toBeTruthy();
      expect(error.status).toEqual(404);
      expect(error.message).toEqual(ErrorMessages.USER_NOT_FOUND);

      expect(userFindOneSpy).toHaveBeenCalledTimes(1);
      expect(userFindOneSpy).toHaveBeenCalledWith({
        where: {
          id: user.id,
        },
      });

      expect(taskSaveSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const task = {
        id: 1,
        title: 'title',
        description: 'description',
        status: TaskStatus.IN_PROGRESS,
      };

      const taskFindOneSpy = jest
        .spyOn(taskRepository, 'findOne')
        .mockResolvedValue(task);

      const taskSaveSpy = jest
        .spyOn(taskRepository, 'save')
        .mockResolvedValue(true);

      const result = await service.update(
        task.id,
        {
          description: 'new description',
        },
        user,
      );

      expect(result).toEqual(task);

      expect(taskFindOneSpy).toHaveBeenCalledTimes(1);
      expect(taskFindOneSpy).toHaveBeenCalledWith({
        where: {
          id: task.id,
          userId: user.id,
        },
      });

      expect(taskSaveSpy).toHaveBeenCalledTimes(1);
      expect(taskSaveSpy).toHaveBeenCalledWith({
        ...task,
        description: 'new description',
      });
    });

    it('should throw an error when a task is not found', async () => {
      const task = {
        id: 1,
        title: 'title',
        description: 'description',
        status: TaskStatus.IN_PROGRESS,
      };

      const taskFindOneSpy = jest
        .spyOn(taskRepository, 'findOne')
        .mockResolvedValue(null);

      const taskSaveSpy = jest.spyOn(taskRepository, 'save');

      let response;
      let error;

      try {
        response = await service.update(
          task.id,
          {
            description: task.description,
          },
          user,
        );
      } catch (err) {
        error = err;
      }

      expect(response).toEqual(undefined);

      expect(error instanceof NotFoundException).toBeTruthy();
      expect(error.status).toEqual(404);
      expect(error.message).toEqual(ErrorMessages.TASK_NOT_FOUND);

      expect(taskFindOneSpy).toHaveBeenCalledTimes(1);
      expect(taskFindOneSpy).toHaveBeenCalledWith({
        where: {
          id: task.id,
          userId: user.id,
        },
      });

      expect(taskSaveSpy).toHaveBeenCalledTimes(0);
    });
  });
});
