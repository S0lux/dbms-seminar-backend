import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '../users/entities/user.entity';
import { LocalSessionStrategy } from './strategies/local-session.strategy';
import { Session } from './strategies/session';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService, LocalSessionStrategy, Session],
})
export class AuthModule {}
