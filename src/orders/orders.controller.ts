import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ORDER_SERVICE } from '../config/service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderPaginationDto } from './dto/order-pagination.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { StatusDto } from './dto/status.dto.js';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll( @Query() OrderPaginationDto: OrderPaginationDto ) {
    return this.ordersClient.send('findAllOrders', OrderPaginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send('findOneOrder', {id})
      );
      return order;
      
    } catch (error: any) {
      throw new RpcException(error)
    }
    
  }

  @Get(':status')
  async findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    try {
      
      return this.ordersClient.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      });
      
    } catch (error: any) {
      throw new RpcException(error)
    }
    
  }

}
