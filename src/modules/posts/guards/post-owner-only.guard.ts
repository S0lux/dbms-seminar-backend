import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PostEntity } from '../entities/post.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Response } from 'express';
import { PostNotFoundError } from '../errors/post-not-found.error';

@Injectable()
export class PostOwnerOnly implements CanActivate {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: EntityRepository<PostEntity>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    const postId = request.params.postId;
    const userId = request.user;

    if (!userId) return false;

    const post = await this.postRepository.findOne(postId, {
      populate: ['author'],
    });

    if (!post) {
      const error = new PostNotFoundError(postId);
      response.status(error.statusCode).json(error.toJSON());
      return;
    }

    return post.author.id === userId;
  }
}
