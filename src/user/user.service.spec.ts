import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { use } from 'passport';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository;

  class MockPinoLogger {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PinoLogger,
          useClass: MockPinoLogger,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an user', async () => {
      const user = {
        id: 1,
        email: 'email',
        username: 'username',
      };

      const userFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(user);

      const query = {
        where: {
          id: user.id,
        },
      };

      const result = await service.findOne(query);

      expect(result).toEqual(user);
      expect(userFindOneSpy).toHaveBeenCalledTimes(1);
      expect(userFindOneSpy).toHaveBeenCalledWith(query);
    });
  });

  describe('create', () => {
    it('should create an user', async () => {
      const user = {
        id: 1,
        email: 'email',
        username: 'username',
      };

      const userFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(null);

      const userSaveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(user);

      const result = await service.create({
        email: user.email,
        username: user.username,
        role: UserRole.ADMIN,
        password: 'password',
      });

      const findOneUserQuery = {
        where: {
          email: user.email,
        },
      };

      expect(result).toEqual(user);
      expect(userFindOneSpy).toHaveBeenCalledTimes(1);
      expect(userFindOneSpy).toHaveBeenCalledWith(findOneUserQuery);
      expect(userSaveSpy).toHaveBeenCalledTimes(1);
      expect(userSaveSpy).toHaveBeenCalledWith({
        email: user.email,
        username: user.username,
        role: UserRole.ADMIN,
        password: expect.any(String),
      });
    });

    it('should throw an error when a user already exists', async () => {
      const user = {
        id: 1,
        email: 'email',
        username: 'username',
      };

      const userFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(user);

      const userSaveSpy = jest.spyOn(userRepository, 'save');

      let response;
      let error;

      try {
        response = await service.create({
          email: user.email,
          username: user.username,
          role: UserRole.ADMIN,
          password: 'password',
        });
      } catch (err) {
        error = err;
      }

      const findOneUserQuery = {
        where: {
          email: user.email,
        },
      };

      expect(response).toEqual(undefined);

      expect(error instanceof UnprocessableEntityException).toBeTruthy();
      expect(error.status).toEqual(422);
      expect(error.message).toEqual('Unprocessable Entity');

      expect(userFindOneSpy).toHaveBeenCalledTimes(1);
      expect(userFindOneSpy).toHaveBeenCalledWith(findOneUserQuery);
      expect(userSaveSpy).toHaveBeenCalledTimes(0);
    });
  });
});
