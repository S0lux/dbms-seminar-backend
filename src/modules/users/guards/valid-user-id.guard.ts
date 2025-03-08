import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UserEntity } from '../entities/user.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Response } from 'express';
import { UserNotFoundError } from '../errors/user-not-found.error';
import { isUUID } from 'class-validator';

@Injectable()
export class ValidUserId implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const userId = request.params.userId;
    if (!userId) return true;

    // Check if userId is a valid UUID format
    if (!isUUID(userId, 4)) {
      const error = new UserNotFoundError(userId);
      response.status(error.statusCode).json(error.toJSON());
      return false;
    }

    // Check if user exists
    const userExists = await this.userRepository.findOne({
      id: userId,
    });

    if (!userExists) {
      const error = new UserNotFoundError(userId);
      response.status(error.statusCode).json(error.toJSON());
      return false;
    }

    return true;
  }
}
