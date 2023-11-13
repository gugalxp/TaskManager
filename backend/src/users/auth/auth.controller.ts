import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  async create(@Body() createUserDto: CreateAuthDto) {

    try {
      return await this.authService.execute(createUserDto);

    } catch (error) {
      return {
        message: error.message,
        user: null,
        error: 'Bad Request',
        statusCode: 400,
      };
    }
  }
}
