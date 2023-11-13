import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './users/auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ApiTokenCheckMiddleware } from './middleware/api-token-check-midleware';

@Module({
  imports: [AuthModule, UsersModule, TasksModule, TasksModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiTokenCheckMiddleware).forRoutes(
      { path: 'tasks', method: RequestMethod.ALL },
      { path: 'tasks/:id', method: RequestMethod.ALL },
      { path: 'users', method: RequestMethod.GET },
      { path: 'tasks/notConcluded/:id', method: RequestMethod.GET },
      { path: 'tasks/concluded/:id', method: RequestMethod.GET }
    )
  }
}
