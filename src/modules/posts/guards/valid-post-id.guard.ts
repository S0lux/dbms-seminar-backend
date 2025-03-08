import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Response } from 'express';
import { isUUID } from 'class-validator';
import { PostEntity } from '../entities/post.entity';
import { PostNotFoundError } from '../errors/post-not-found.error';

@Injectable()
export class ValidPostId implements CanActivate {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: EntityRepository<PostEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const postId = request.params.postId;
    if (!postId) return true;

    // Check if postId is a valid UUID format
    if (!isUUID(postId, 4)) {
      const error = new PostNotFoundError(postId);
      response.status(error.statusCode).json(error.toJSON());
      return false;
    }

    // Check if post exists
    const postExists = await this.postRepository.findOne({
      id: postId,
    });

    if (!postExists) {
      const error = new PostNotFoundError(postId);
      response.status(error.statusCode).json(error.toJSON());
      return false;
    }

    return true;
  }
}
