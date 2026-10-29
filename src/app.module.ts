import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { NatsModule } from './transports/nats.module.js';
import { AuthModule } from './auth/auth.module.js';
import { HealthCheckModule } from './health-check/health-check.module.js';
@Module({
  imports: [ProductsModule, OrdersModule, NatsModule, AuthModule, HealthCheckModule],
})
export class AppModule {}
