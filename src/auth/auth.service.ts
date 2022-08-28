import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserReqDto } from 'src/user/dto/create-user-req.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { LoginRespDto } from './dto/login-resp.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOne({
      where: {
        email,
      },
    });
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<LoginRespDto> {
    const payload = this.mountPayload(user);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: CreateUserReqDto): Promise<LoginRespDto> {
    const user = await this.userService.create(data);
    const payload = this.mountPayload(user);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private mountPayload({ email, id, role }: User) {
    return { email, sub: id, role };
  }
}
