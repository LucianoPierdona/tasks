import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthRespDto } from '../auth/dto/auth-resp.dto';
import { CurrentUser } from '../common/decorators/user.decorator';

import { CreateTaskReqDto } from './dto/create-task-req.dto';
import { UpdateTaskReqDto } from './dto/update-task-req.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@UsePipes(ValidationPipe)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  async create(
    @Body() data: CreateTaskReqDto,
    @CurrentUser() user: AuthRespDto,
  ) {
    return await this.taskService.create(data, user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateTaskReqDto,
    @CurrentUser() user: AuthRespDto,
  ) {
    return await this.taskService.update(Number(id), data, user);
  }

  @Get('')
  async list(
    @Query('limit') limit: string,
    @Query('page') page: string,
    @CurrentUser() user: AuthRespDto,
  ) {
    return await this.taskService.list({
      limit: Number(limit),
      page: Number(page),
      user,
    });
  }

  @Get(':id')
  async get(@Param('id') id: string, @CurrentUser() user: AuthRespDto) {
    return await this.taskService.get(Number(id), user);
  }
}
