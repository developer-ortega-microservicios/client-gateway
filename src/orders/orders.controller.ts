import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { NATS_SERVICE } from '../config/service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderPaginationDto } from './dto/order-pagination.dto.js';
import { StatusDto } from './dto/status.dto.js';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await firstValueFrom(
        this.client.send('createOrder', createOrderDto)
      );
      return order;
    } catch (error: any) {
      throw new RpcException(error)
    }
  }

  @Get()
  async findAll(@Query() OrderPaginationDto: OrderPaginationDto) {
    try {
      const order = await firstValueFrom(
        this.client.send('findAllOrders', OrderPaginationDto)
      );
      return order;
    } catch (error: any) {
      throw new RpcException(error)
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id })
      );
      return order;

    } catch (error: any) {
      throw new RpcException(error)
    }

  }

  @Get(':status')
  findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    try {

      return this.client.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      });

    } catch (error: any) {
      throw new RpcException(error)
    }

  }

  @Patch(':id')
  changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    try {
      return this.client.send('changeOrderStatus', { id, status: statusDto.status })
    } catch (error: any) {
      throw new RpcException(error)
    }
  }

}
