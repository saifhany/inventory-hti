import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    ParseIntPipe,
    Res, 
     Query,
    UseGuards,
    Response,
    Patch
  } from '@nestjs/common';
  
  import { AuthGuard } from '@nestjs/passport';
  import { Product } from './entities/product.entity';
  import { ProductService } from './product.service';
  import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
  import { SuppliersAuthGuard } from '../../commons/guards/suppliers.auth.guard';
  import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
  import { Roles } from 'src/commons/decorators/roles.decorator';
  import { Role } from '../../commons/enums/role.enum';
import { Type } from 'src/commons/enums/product.type.enum';
import { ProductGuard } from 'src/commons/guards/getproducts-guard';
import { OutofStoreGuard } from 'src/commons/guards/OutofStoreGuard';

  
  @Controller('product')
  export class ProductController {
  
    constructor(private productService: ProductService) {
    }

    @Post('create')
    @UseGuards(AuthGuard(), SuppliersAuthGuard)
    @Roles(Role.SUPPLIERS)
    create(@Req() req,@Body('type') type: Type,@Body('name') name: string, @Body('count') count: number,@Body('nameofsupplier') nameofsupplier:string ,@Body('phoneofsupplier') phoneofsupplier:string, @Body('supplieredCompany') supplieredCompany:string,@Body('description') description:string ,@Response() res ): Promise<any> {
      return this.productService.createProduct(req.user.id,type,name,count,nameofsupplier,phoneofsupplier,supplieredCompany,description,res);
    }
  
    @Patch('update/:id')
    update( @Param('id') id: number,@Body('type') type: Type,@Body('name') name: string, @Body('count') count: number,@Body('nameofsupplier') nameofsupplier:string ,@Body('phoneofsupplier') phoneofsupplier:string, @Body('supplieredCompany') supplieredCompany:string,@Body('description') description:string ,@Response() res ): Promise<any> {
      return this.productService.updateProduct(type,id,name,count,nameofsupplier,phoneofsupplier,supplieredCompany,description,res);
    }

    @Get('getByid/:id')
    getById(@Param('id') id: number,@Response() res ): Promise<any> {
      return this.productService.getById(id,res);
    }
  
    @Get('get-all-instore')
    @UseGuards(AuthGuard(), ProductGuard)
    @Roles(Role.SECTION || Role.STOREMANAGER || Role.STOREKEPPER  ||Role.SUPERVISORYOFFICER )
    getAllInStore(@Response() res,  @Query('type') type: Type ,@Query('name') name: string, @Query('limit') limit:number ,@Query('skip')skip:number ): Promise<any> {
      return this.productService.getAllInStore(res,type,name,limit,skip);
    }
  
    @Get('get-all-outofstore')
    @UseGuards(AuthGuard(), OutofStoreGuard)
    @Roles(Role.ADDITIONOFFICIAL || Role.SUPPLIERS ||Role.SUPERVISORYOFFICER )
    getAllOutOfStore(@Req()req,@Response() res,  @Query('type') type: Type ): Promise<any> {
      return this.productService.getAllOutOfStore(req.user.id,res,type);
    }
    
  
  
  
  
   
    
  
  }
  