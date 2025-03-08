import { AuthError } from './base-auth.error';
import { HttpStatus } from '@nestjs/common';

export class EmailNotFoundError extends AuthError {
  constructor(email: string) {
    super(`No user with the email '${email}' was found.`);
    this.name = 'EmailNotFoundError';
    this.statusCode = HttpStatus.UNAUTHORIZED;
  }
}
