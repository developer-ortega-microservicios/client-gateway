import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { NatsModule } from './transports/nats.module.js';
@Module({
  imports: [ProductsModule, OrdersModule, NatsModule],
})
export class AppModule {}
