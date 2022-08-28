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
import { PaginationReqDto } from '../common/dto/pagination-req.dto';
import { CreateTaskReqDto } from './dto/create-task-req.dto';
import { UpdateTaskReqDto } from './dto/update-task-req.dto';
import { TaskService } from './task.service';

@Controller('tasks')
@UsePipes(ValidationPipe)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('')
  async create(@Body() data: CreateTaskReqDto) {
    return await this.taskService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateTaskReqDto) {
    return await this.taskService.update(Number(id), data);
  }

  @Get('')
  async list(@Query('limit') limit: string, @Query('page') page: string) {
    return await this.taskService.list({
      limit: Number(limit),
      page: Number(page),
    });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return await this.taskService.get(Number(id));
  }
}
