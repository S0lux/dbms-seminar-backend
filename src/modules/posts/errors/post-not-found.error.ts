import { PostError } from './base-post.error';
import { HttpStatus } from '@nestjs/common';

export class PostNotFoundError extends PostError {
  constructor(postId: string) {
    super(`Post with id '${postId}' not found`);
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}
