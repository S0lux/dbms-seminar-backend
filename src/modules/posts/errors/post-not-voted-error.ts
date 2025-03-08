import { PostError } from './base-post.error';
import { HttpStatus } from '@nestjs/common';

export class PostNotVotedError extends PostError {
  constructor(postId: string) {
    super(`Post with id '${postId}' has not been voted`);
    this.statusCode = HttpStatus.BAD_REQUEST;
  }
}
