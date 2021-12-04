import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserLoginDto, UserRegisterDto } from 'src/models/user.model';
import { ReturningStatementNotSupportedError } from 'typeorm';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  // @UsePipes(ValidationPipe)
  register(@Body(ValidationPipe) body: UserRegisterDto) {
    return this.authService.register(body);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Body() body: UserLoginDto) {
    return this.authService.login(body);
  }
}
