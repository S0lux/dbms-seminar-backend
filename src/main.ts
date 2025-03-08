import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
import Redis from 'ioredis';
import { RedisStore } from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<EnvConfig>);
  const redisClient = new Redis({
    port: configService.get('REDIS_PORT'),
    host: configService.get('REDIS_HOST'),
    password: configService.get('REDIS_PASSWORD'),
  });

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
  });

  app.enableVersioning();

  app.use(
    session({
      store: redisStore,
      secret: configService.get('SESSION_SECRET'),
      resave: Boolean(process.env.SESSION_RESAVE),
      saveUninitialized: Boolean(process.env.SESSION_SAVE_UNINITIALIZED),
      cookie: {
        maxAge:
          configService.get('SESSION_COOKIE_MAX_AGE_DAYS') *
          (1000 * 60 * 60 * 24),
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000);
}

bootstrap();
