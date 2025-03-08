import { BaseError } from '../../../shared/base.error';

export class VoteError extends BaseError {
  constructor(message: string) {
    super(message);
    this.name = 'VoteError';
  }
}
