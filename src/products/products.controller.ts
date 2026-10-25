import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { PRODUCT_SERVICE } from '../config/service.js';
import { ClientProxy } from '@nestjs/microservices';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy
  ) {}

  @Post()
  createProduct(){
    return 'Crea un producto';
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto){
    return this.productsClient.send({ cmd: 'find_all' }, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string ){
    try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_one_product' }, {id})
      )
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
    
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string ){
    return `Elimina un producto con el id ${id}`
  }

  @Patch(':id')
  patchProduct(@Param('id') id: string, @Body() body: any){
    return `Esta función actualiza el producto con el id ${id}`
  }
}
