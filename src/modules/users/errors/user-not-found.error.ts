import { UserError } from './base-user.error';
import { HttpStatus } from '@nestjs/common';

export class UserNotFoundError extends UserError {
  constructor(id: string) {
    super(`The user with the id '${id}' does not exist`);
    this.name = 'UserNotFoundError';
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}
