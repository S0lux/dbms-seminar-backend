import { BaseError } from '../../../shared/base.error';

export class PostError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'PostError';
  }
}
