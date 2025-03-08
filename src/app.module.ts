import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envConfigParser } from './config/env.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { PostsModule } from './modules/posts/posts.module';
import { VotesModule } from './modules/votes/votes.module';
import ormConfig from './config/mikro-orm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: envConfigParser }),
    MikroOrmModule.forRoot({
      ...ormConfig,
      entities: undefined,
      entitiesTs: undefined,
      autoLoadEntities: true,
    }),
    UsersModule,
    AuthModule,
    PostsModule,
    VotesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
