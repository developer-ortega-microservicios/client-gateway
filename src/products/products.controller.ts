import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  constructor() {}

  @Post()
  createProduct(){
    return 'Crea un producto';
  }

  @Get()
  findAllProducts(){
    return 'Devuelve todos los productos';
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
