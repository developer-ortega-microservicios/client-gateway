import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { NatsModule } from '../transports/nats.module.js';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    NatsModule
  ]
})
export class ProductsModule { }
