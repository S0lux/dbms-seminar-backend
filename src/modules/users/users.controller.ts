import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountRequestDto } from './dtos/create-account-request.dto';
import { Response } from 'express';
import { ValidUserId } from './guards/valid-user-id.guard';

@UseGuards(ValidUserId)
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  public async createAccount(
    @Body() createAccountRequest: CreateAccountRequestDto,
    @Res() res: Response,
  ) {
    const result = await this.usersService.createUser(createAccountRequest);

    if (result.isErr())
      return res.status(result.error.statusCode).json(result.error.toJSON());
    else return res.status(HttpStatus.CREATED).json(result.value);
  }
}
