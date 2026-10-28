import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from '../config/service.js';
import { User } from './decorators/user.decorator.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { AuthGuard } from './guards/auth.guard.js';
import type { CurrentUser } from './interfaces/current-user.interface.js';
import { Token } from './decorators/token.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto).pipe(
      catchError(error => {
        throw new RpcException(error)
      })
    )
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto).pipe(
      catchError(error => {
        throw new RpcException(error)
      })
    )
  }

  @UseGuards( AuthGuard )
  @Get('verify')
  verifyToken(@User() user: CurrentUser, @Token() token: string) {
    return { user, token }
  }
}
