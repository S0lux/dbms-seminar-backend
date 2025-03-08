import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request, Response } from 'express';
import { AuthenticatedOnly } from './guards/authenticated.guard';
import { UserId } from './decorators/user.decorator';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthenticatedOnly)
  @Post('logout')
  logout(@Req() request: Request) {
    request.session.destroy(() => {
      return { message: 'Logout successful' };
    });
  }

  @UseGuards(LocalGuard)
  @Post('login')
  login() {
    return { message: 'Successfully logged in' };
  }

  @UseGuards(AuthenticatedOnly)
  @Get('me')
  async me(
    @Req() request: Request,
    @UserId() userId: string,
    @Res() response: Response,
  ) {
    const result = await this.authService.deserializeUser(userId);
    if (result.isErr()) {
      // Session is no longer valid
      // Logout the user
      request.session.destroy(() => {});
      return response
        .status(result.error.statusCode)
        .json(result.error.toJSON());
    } else return response.status(HttpStatus.OK).json(result.value);
  }
}
