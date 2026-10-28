import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { NatsModule } from '../transports/nats.module.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    NatsModule
  ]
})
export class AuthModule {}
