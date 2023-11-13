import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async handle(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);

    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  @Get()
  async findDataUsers(@Req() req) {
    try {
      const userId = req.id; // Agora você pode acessar req.id
      return await this.userService.findAll(userId);
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}
