import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserEntity } from '../users/entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { AuthError } from './errors/base-auth.error';
import { err, ok, Result } from 'neverthrow';
import { EmailNotFoundError } from './errors/email-not-found.error';
import { InvalidPasswordError } from './errors/invalid-password.error';
import * as argon2 from 'argon2';
import { DeserializationError } from './errors/deserialization.error';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<Result<UserEntity, AuthError>> {
    const user = await this.userRepository.findOne({ email });
    if (!user) return err(new EmailNotFoundError(email));

    const isPasswordValid = await argon2.verify(user.hashedPassword, password);
    if (!isPasswordValid) return err(new InvalidPasswordError());

    return ok(user);
  }

  public async deserializeUser(
    id: string,
  ): Promise<Result<UserEntity, AuthError>> {
    const user = await this.userRepository.findOne({ id });
    if (!user) return err(new DeserializationError(id));
    return ok(user);
  }
}
