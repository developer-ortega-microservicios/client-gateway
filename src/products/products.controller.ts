import { Body, Controller, Delete, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { PRODUCT_SERVICE } from '../config/service.js';
import { ClientProxy } from '@nestjs/microservices';

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
  findAllProducts(){
    return this.productsClient.send({ cmd: 'find_all' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string ){
    return `Devuelve un producto con un id ${id}`
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
