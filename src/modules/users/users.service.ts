import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserEntity } from './entities/user.entity';
import {
  EntityManager,
  EntityRepository,
  Transactional,
} from '@mikro-orm/postgresql';
import { CreateAccountRequestDto } from './dtos/create-account-request.dto';
import { err, ok, Result } from 'neverthrow';
import { UserError } from './errors/base-user.error';
import { EmailTakenError } from './errors/email-taken.error';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: EntityRepository<UserEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  @Transactional()
  public async createUser(
    data: CreateAccountRequestDto,
  ): Promise<Result<UserEntity, UserError>> {
    const isEmailExists = await this.usersRepository.findOne({
      email: data.email,
    });
    if (isEmailExists) return err(new EmailTakenError(data.email));

    const newUser = this.usersRepository.create({
      email: data.email,
      displayName: data.displayName,
      hashedPassword: await argon2.hash(data.password),
    });

    try {
      await this.entityManager.flush();
      return ok(newUser);
    } catch (error) {
      console.error(error);
      return err(new UserError('Unexpected error'));
    }
  }
}
