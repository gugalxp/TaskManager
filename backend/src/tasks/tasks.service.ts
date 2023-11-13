import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import prismaClient from 'src/prisma';

@Injectable()
export class TasksService {
  async filterTasksConcludedService(userId: string) {

    try {
      const tasks = await prismaClient.task.findMany({
        where: {
          userId,
          finished_date: {
            not: null,
          },
        },
      });

      return tasks || [];
    } catch (error) {
      throw new Error(`Erro ao obter as tarefas: ${error.message}`);
    }
  }

  async filterTasksNotConcludedService(userId: string) {
    
    try {
      const tasks = await prismaClient.task.findMany({
        where: {
          userId,
          finished_date: null
        },
      });

      return tasks || [];
    } catch (error) {
      throw new Error(`Erro ao obter as tarefas: ${error.message}`);
    }
  }



  async create(createTaskDto: CreateTaskDto) {
    try {
      const createTasks = await prismaClient.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
          finished_date: createTaskDto.finished_date,
          created_at: createTaskDto.created_at,
          userId: createTaskDto.userId
        }
      });

      return createTasks;
    } catch (error) {
      throw new Error(`Erro ao criar a tarefa: ${error.message}`);
    }
  }

  async findAll(userId: string) {
    try {
      const tasks = await prismaClient.task.findMany({
        where: {
          userId
        },
      });

      return tasks || [];
    } catch (error) {
      throw new Error(`Erro ao obter as tarefas: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const task = await prismaClient.task.findUnique({
        where: {
          id: id,
        },
      });

      if (!task) {
        throw new Error(`Esta tarefa não existe`);
      }

      return task;
    } catch (error) {
      throw new Error(`Erro ao obter a tarefa: ${error.message}`);
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const updatedTask = await prismaClient.task.update({
        where: {
          id: id,
        },
        data: {
          name: updateTaskDto.name,
          description: updateTaskDto.description,
          finished_date: updateTaskDto.finished_date
        },
      });

      return updatedTask;
    } catch (error) {
      throw new Error(`Erro ao atualizar a tarefa: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const deletedTask = await prismaClient.task.delete({
        where: {
          id: id,
        },
      });

      return { message: "Tarefa excluída com sucesso", deletedTask };
    } catch (error) {
      throw new Error(`Erro ao excluir a tarefa: ${error.message}`);
    }
  }
}
