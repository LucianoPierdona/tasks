import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserReqDto } from '../user/dto/create-user-req.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthRespDto } from './dto/auth-resp.dto';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() data: CreateUserReqDto) {
    return this.authService.register(data);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: AuthRespDto): AuthRespDto {
    return user;
  }
}
