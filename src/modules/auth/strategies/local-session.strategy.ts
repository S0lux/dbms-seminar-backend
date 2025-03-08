import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { HttpException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalSessionStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string) {
    const result = await this.authService.validateUser(email, password);
    if (result.isErr()) {
      throw new HttpException(result.error.message, result.error.statusCode);
    }
    return result.value;
  }
}
