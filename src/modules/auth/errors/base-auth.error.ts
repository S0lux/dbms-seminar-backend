import { BaseError } from '../../../shared/base.error';

export class AuthError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}
