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
  import { Order } from './entities/order.entity';
  import { OrderService } from './order.service';
  import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
  import { SuppliersAuthGuard } from '../../commons/guards/suppliers.auth.guard';
  import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
  import { OrderCreationGuard } from '../../commons/guards/orderCreationGuard';
  import { Roles } from 'src/commons/decorators/roles.decorator';
  import { Role } from '../../commons/enums/role.enum';
import { Type } from 'src/commons/enums/product.type.enum';
import { ProductGuard } from 'src/commons/guards/getproducts-guard';
import { OrderStatus } from 'src/commons/enums/order.status';
import { OrderViewGuard } from 'src/commons/guards/OrderViewGuard';
import { OrderByIdGuard} from 'src/commons/guards/orderById-auth-guard';
  
  @Controller('order')
  export class OrderController {
  
    constructor(private orderService: OrderService) {
    }

    @Post('create')
    @UseGuards(AuthGuard(), OrderCreationGuard)
    @Roles(Role.SECTION)
    create( @Req() req , @Body('orderedProducts') orderedProducts: Array<{}> , @Body('notes') notes: string , @Response() res ): Promise<any> {
      return this.orderService.createOrder(req.user.id, orderedProducts, notes, res);
    }
    
    @Get('getOrders')
    @UseGuards(AuthGuard(), OrderViewGuard)
    @Roles(Role.STOREKEPPER ||   Role.STOREMANAGER  ||  Role.ADMIN||  Role.SUPPLIERS )
    GetOrders( @Req() req , @Response() res , @Query('orderstatus') orderstatus: OrderStatus): Promise<any> {
      return this.orderService.getOrders(req.user.id,res,orderstatus);
    }
    
    @Patch('update/:id')
    @UseGuards(AuthGuard(), OrderViewGuard)
    @Roles(Role.STOREKEPPER ||   Role.STOREMANAGER  ||  Role.ADMIN||  Role.SUPPLIERS )
    update( @Req() req , @Response() res, @Param('id', ParseIntPipe) id: number, @Body('acceptFromManagerStore') acceptFromManagerStore: OrderStatus ): Promise<any> {
      return this.orderService.updateOrder(req.user.id, id, acceptFromManagerStore, res);
    }

    @Get('getorder/:id')
    @UseGuards(AuthGuard(), OrderByIdGuard)
    @Roles(Role.STOREKEPPER ||   Role.STOREMANAGER  ||  Role.ADMIN||  Role.SUPPLIERS || Role.SECTION )
    getOrder( @Response() res, @Param('id', ParseIntPipe) id: number): Promise<any> {
      return this.orderService.getOrder( id, res);
    }

    // @Patch('update/:id')
    // @UseGuards(AuthGuard(), SuppliersAuthGuard)
    // @Roles(Role.SUPPLIERS)
    // update( @Param('id') id: number,@Body('type') type: Type,@Body('name') name: string, @Body('count') count: number,@Body('nameofsupplier') nameofsupplier:string ,@Body('phoneofsupplier') phoneofsupplier:string, @Body('supplieredCompany') supplieredCompany:string,@Body('description') description:string ,@Response() res ): Promise<any> {
    //   return this.productService.updateProduct(type,id,name,count,nameofsupplier,phoneofsupplier,supplieredCompany,description,res);
    // }
  
  
  
  
    // @Get('getByid/:id')
    // @UseGuards(AuthGuard(), ProductGuard)
    // @Roles(Role.SECTION || Role.STOREMANAGER || Role.STOREKEPPER )
    // getById(@Param('id') id: number,@Response() res ): Promise<any> {
    //   return this.productService.getById(id,res);
    // }
  
    // @Get('get-all-instore')
    // @UseGuards(AuthGuard(), ProductGuard)
    // @Roles(Role.SECTION || Role.STOREMANAGER || Role.STOREKEPPER )
    // getAllInStore(@Response() res,  @Query('type') type: Type ,@Query('name') name: string, @Query('limit') limit:number ,@Query('skip')skip:number ): Promise<any> {
    //   return this.productService.getAllInStore(res,type,name,limit,skip);
    // }
  
    // @Get('get-all-outofstore')
    // @UseGuards(AuthGuard(), ProductGuard)
    // @Roles(Role.SECTION || Role.STOREMANAGER || Role.STOREKEPPER )
    // getAllOutOfStore(@Response() res,  @Query('type') type: Type ): Promise<any> {
    //   return this.productService.getAllOutOfStore(res,type);
    // }
  
    
  
  
    // @Post('login/user')
    // signInUserDto(@Body('email') email: string,@Body('password') password: string ,@Response() res ):Promise<any> {
    //   console.log(email,password);
    //   return  this.authService.signInUser(email,password,res);
    //   // if(user){
    //   //   return res.json({
    //   //     status: true,
    //   //     data:user
    //   //   })
    //   // }
      
    // }
  
  
  
   
    // @Get('user-main-data')
    // @UseGuards(AuthGuard('jwt'), AcceptedAuthGuard)
    // @Roles([Role.USER, Role.ADMIN])
    // getUserData(@GetAuthenticatedUser() user: User) {
    //   return this.authService.getUserMainData(user);
    // }
  
    // @Delete('delete-user-account/:userId')
    // @UseGuards(AuthGuard(), AdminAuthGuard)
    // @Roles(Role.ADMIN)
    // deleteUserAccount(@Param('userId') userId: number,@Response() res): Promise<any>{
    //   const user = this.authService.deleteUserAccount(userId);
    //   if(user){
    //     return res.json({
    //       status: true,
    //       message: 'تم حذف الموظف بنجاح',
    //     }) 
    //   }
    // }
  
  
    // // @Post('login/admin')
    // // signInAdmin(@Body() emailLoginDto: EmailLoginDto) {
    // //   return this.authService.signInAdmin(emailLoginDto);
    // // }
  
    // @Get('system-users')
    // @UseGuards(AuthGuard(), AdminAuthGuard)
    // @Roles(Role.ADMIN || Role.STOREMANAGER)
    // getSystemUsers(@Query('limit') limit: number,
    // @Query('roles') roles: Role,
    // @Query('username') username: string,
    // @Query('skip') skip: number,
    // @Query('sections') sections: SECTION,
    // @Query('branch') branch: Branch,
    // @Response() res :Response
    // ) {
    //   return this.authService.getSystemUsers(limit,roles,username,skip,sections,branch,res);
    // }
  
    // @UseGuards(AuthGuard(), AdminAuthGuard)
    // @Roles(Role.ADMIN)
    // @Get('users/:id')
    // getUserById(@Param('id', ParseIntPipe) id: number ) {
    //   return this.authService.getUserById(id);
    // }
  
    
  
    // @UseGuards(AuthGuard(), AdminAuthGuard)
    // @Roles(Role.ADMIN)
    // @Patch('edit-user-roles/:userId')
    // editUserRoles(@Param('userId', ParseIntPipe) userId: number, @Body() userRoleDto: UserRoleDto) {
    //   return this.authService.editUserRoles(userId, userRoleDto);
    // }
  
    // @UseGuards(AuthGuard(), AdminAuthGuard)
    // @Roles(Role.ADMIN)
    // @Put('edit-user-password/:userId')
    // editUserPassword(@Param('userId', ParseIntPipe) userId: number, @Body() updatePasswordDto: UpdatePasswordDto) {
    //   return this.authService.editUserPassword(userId, updatePasswordDto.password);
    // }
  
  
  }
  