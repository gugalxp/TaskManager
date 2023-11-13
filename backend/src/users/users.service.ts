import { Injectable } from '@nestjs/common';
import prismaClient from 'src/prisma';
import { hash } from "bcryptjs";
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  
  async findAll(userId: string) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          id: userId
        }
      });

      if (!user) {
        throw new Error(`Não foram encontrados dados deste usuário`);
      }

      return user;
    } catch (error) {
      throw new Error(`Erro ao obter as tarefas: ${error.message}`);
    }
  }

  async create(user: CreateUserDto): Promise<CreateUserDto> {
    try {
      for (const key in user) {
        if (!user[key]) {
          throw new Error(`O campo ${key} é obrigatório`);
        }
      }

      const userAlreadyExist = await prismaClient.user.findFirst({
        where: {
          email: user.email,
        }
      });
 
      if (userAlreadyExist) {
        throw new Error("Esse e-mail já está cadastrado");
      }

      const passwordHash = await hash(user.password, 8);

      const userCreate = await prismaClient.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: passwordHash
        },
      });

      return userCreate;

    } catch (error) {
      throw new Error(error.message);
    }
  }
}
