import { AuthError } from './base-auth.error';
import { HttpStatus } from '@nestjs/common';

export class DeserializationError extends AuthError {
  constructor(id: string) {
    super(`Cannot deserialize the id '${id} to an existing user'`);
    this.statusCode = HttpStatus.NOT_FOUND;
  }
}
