import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export class AuthenticatedOnly implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    if (!http.getRequest().isAuthenticated()) {
      throw new UnauthorizedException('You are not logged in');
    }

    return true;
  }
}
