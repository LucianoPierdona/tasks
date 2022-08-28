import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PinoLogger } from 'nestjs-pino';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserReqDto } from './dto/create-user-req.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: PinoLogger,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(options: FindOneOptions<User>): Promise<User | undefined> {
    return this.userRepository.findOne(options);
  }

  async create({
    email,
    password,
    username,
    role,
  }: CreateUserReqDto): Promise<User | undefined> {
    const userAlreadyExists = await this.findOne({
      where: {
        email,
      },
    });

    if (userAlreadyExists) {
      throw new UnprocessableEntityException();
    }

    const user = new User();

    user.email = email;
    user.password = password;
    user.username = username;
    user.role = role;

    return this.userRepository.save(user);
  }
}
