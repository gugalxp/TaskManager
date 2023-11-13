import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const usersApp = await NestFactory.create(AppModule);

  usersApp.enableCors();

  await usersApp.listen(3333, () => console.log("Users Server is running on port 3333"));
}

bootstrap();
