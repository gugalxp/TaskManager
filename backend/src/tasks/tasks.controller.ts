import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  async handle(@Body() createTaskDto: CreateTaskDto) {
    try {
      const task = await this.tasksService.create(createTaskDto);
      return task;
    } catch (error) {
      return { message: error.message, error: 'Bad Request', statusCode: 400 };
    }
  }

  @Get('notConcluded/:userId')
  async filterTasksNotConcludedController(@Param('userId') userId: string) {

    try {
      const tasks = await this.tasksService.filterTasksNotConcludedService(userId);
      return tasks;
    } catch (error) {
      return { message: error.message, error: 'Bad Request', statusCode: 400 };
    }
  }

  @Get('concluded/:userId')
  async filterTasksConcludedController(@Param('userId') userId: string) {

    try {
      const tasks = await this.tasksService.filterTasksConcludedService(userId);
      return tasks;
    } catch (error) {
      return { message: error.message, error: 'Bad Request', statusCode: 400 };
    }
  }

  @Get(':userId')
  async findAll(@Param('userId') userId: string) {

    try {
      const tasks = await this.tasksService.findAll(userId);
      return tasks;
    } catch (error) {
      return { message: error.message, error: 'Bad Request', statusCode: 400 };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const task = await this.tasksService.findOne(id);
      return task;
    } catch (error) {
      return { message: error.message, error: 'Bad Request', statusCode: 400 };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      const updatedTask = await this.tasksService.update(id, updateTaskDto);
      console.log(updatedTask)
      return updatedTask;
    } catch (error) {
      return { message: error.message, error: 'Bad Request', statusCode: 400 };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedTask = await this.tasksService.remove(id);
      return deletedTask;
    } catch (error) {
      return { message: error.message, error: 'Bad Request', statusCode: 400 };
    }
  }
}
