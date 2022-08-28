import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus } from '../task.entity';

export class CreateTaskReqDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
