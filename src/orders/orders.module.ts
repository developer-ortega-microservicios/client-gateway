import { Module } from '@nestjs/common';
import { NatsModule } from '../transports/nats.module.js';
import { OrdersController } from './orders.controller.js';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    NatsModule
  ]
})
export class OrdersModule { }
