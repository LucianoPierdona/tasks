import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { encryptPassword } from '../common/utils/encrypt-password';
import { User, UserRole } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthRespDto } from './dto/auth-resp.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService;
  let jwtService;

  const user: AuthRespDto = {
    email: 'email',
    id: 1,
    role: UserRole.ADMIN,
  };

  class MockUserService {
    async findOne() {
      return null;
    }
    async create() {
      return null;
    }
  }
  class MockJwtService {
    sign() {
      return 'test';
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useClass: MockUserService,
        },
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should successfully validate an user', async () => {
      user['password'] = await encryptPassword('password');

      const userFindOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockResolvedValue(user);

      const result = await service.validateUser(user.email, 'password');

      expect(result).toEqual(user);

      expect(userFindOneSpy).toHaveBeenCalledTimes(1);
      expect(userFindOneSpy).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
      });
    });
  });

  describe('login', () => {
    it('should successfully login', async () => {
      const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue('test');

      const result = await service.login(user as User);

      expect(result).toEqual({
        access_token: 'test',
      });

      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
        role: user.role,
      });
    });
  });

  describe('register', () => {
    it('should successfully register', async () => {
      const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue('test');
      const userCreateSpy = jest
        .spyOn(userService, 'create')
        .mockResolvedValue(user);

      const request = {
        email: user.email,
        role: user.role,
        password: 'password',
        username: 'username',
      };

      const result = await service.register(request);

      expect(result).toEqual({
        access_token: 'test',
      });

      expect(userCreateSpy).toHaveBeenCalledTimes(1);
      expect(userCreateSpy).toHaveBeenCalledWith(request);

      expect(signSpy).toHaveBeenCalledTimes(1);
      expect(signSpy).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
        role: user.role,
      });
    });
  });
});
