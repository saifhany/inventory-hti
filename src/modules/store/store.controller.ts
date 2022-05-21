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
  import { Store } from './entities/store.entity';
  import { StoreService } from './store.service';
  import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
  import { AdditionOfficial } from '../../commons/guards/AdditionOfficial';
  import { SuppliersAuthGuard } from '../../commons/guards/suppliers.auth.guard';
  import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
  import { Roles } from 'src/commons/decorators/roles.decorator';
  import { Role } from '../../commons/enums/role.enum';
import { Branch } from 'src/commons/enums/branch.entity';
import { Type } from 'src/commons/enums/product.type.enum';
import { Status } from 'src/commons/enums/product.status.enum';
import { StoreWithAllProduct } from 'src/commons/guards/StoreWithAllProductsGuard';

  
  @Controller('store')
  export class StoreController {
  
    constructor(private storeService: StoreService) {
        
    }

    // @Post('create')
    // @UseGuards(AuthGuard(), SuppliersAuthGuard)
    // @Roles(Role.SUPPLIERS)
    // create(@Body('name') name: string, @Body('count') count: number,@Body('nameofsupplier') nameofsupplier:string ,@Body('phoneofsupplier') phoneofsupplier:string, @Body('supplieredCompany') supplieredCompany:string,@Body('description') description:string ,@Response() res ): Promise<any> {
    //   return this.productService.createProduct(name,count,nameofsupplier,phoneofsupplier,supplieredCompany,description,res);
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
  
  

   
    @Get('hti-store')
    @UseGuards(AuthGuard('jwt'), StoreWithAllProduct)
    @Roles(Role.SECTION || Role.STOREMANAGER || Role.STOREKEPPER  ||Role.SUPERVISORYOFFICER )
    getStoreData(@Req() req ,@Response() res,@Query('name') name: string,@Query('type') type: Type): Promise<any> {
      return this.storeService.getStoreData(req.user.id,res,name,type);
    }
  
    @Patch('add-product-to-store')
    @UseGuards(AuthGuard('jwt'), AdditionOfficial)  
    @Roles(Role.ADDITIONOFFICIAL)
    addProductToStore(@Response() res, @Req() req, @Body('productId') productId:number , @Body('name') name: string, @Body('count') count: number,@Body('nameofsupplier') nameofsupplier:string,@Body('phoneofsupplier') phoneofsupplier:string,@Body('supplieredCompany') supplieredCompany:string,@Body('description') description:string,@Body('type') type:Type,@Body('accept')accept:boolean): Promise<any> {

      return this.storeService.addproductToStore(res,req.user.id,productId,name,count,nameofsupplier,phoneofsupplier,supplieredCompany,description,type,accept);
    }
    


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
  
    // @Get('check-username/:username')
    // isValidUsername(@Param('username') username: string) {
    //   return this.authService.isValidUsername(username);
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
  