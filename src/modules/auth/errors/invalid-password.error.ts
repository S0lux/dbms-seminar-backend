import { AuthError } from './base-auth.error';
import { HttpStatus } from '@nestjs/common';

export class InvalidPasswordError extends AuthError {
  constructor() {
    super('Provided password is invalid');
    this.statusCode = HttpStatus.UNAUTHORIZED;
  }
}
