import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserReqDto {
  @IsEmail()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsDefined()
  @IsNotEmpty()
  role: UserRole;
}
