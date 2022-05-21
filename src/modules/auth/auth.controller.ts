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

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/email-login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../commons/enums/role.enum';
import { AcceptedAuthGuard } from '../../commons/guards/accepted-auth.guard';
import { GetAuthenticatedUser } from '../../commons/decorators/get-authenticated-user.decorator';
import { User } from './entities/user.entity';
import { SECTION } from 'src/commons/enums/section.type';
import { Branch } from 'src/commons/enums/branch.entity';
import { UserRoleDto } from './dto/user-ifno.dto';
import { UpdatePasswordDto } from './dto/update-pass.dto';
import { AdminAuthGuard } from '../../commons/guards/admin-auth.guard';
import { UserAuthGuard } from '../../commons/guards/user-auth.guard';
import { Roles } from 'src/commons/decorators/roles.decorator';


@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }
  @Post('register')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(Role.ADMIN)
  signUp(@Body('email') email: string, @Body('password') password: string,@Body('username') username:string ,@Response() res 
        ): Promise<void> {
    return this.authService.signUp(email,password,username,res);
  }

 




  


  @Post('login/user')
  signInUserDto(@Body('email') email: string,@Body('password') password: string ,@Response() res ):Promise<any> {
    console.log(email,password);
    return  this.authService.signInUser(email,password,res);
    // if(user){
    //   return res.json({
    //     status: true,
    //     data:user
    //   })
    // }
    
  }



 
  // @Get('user-main-data')
  // @UseGuards(AuthGuard('jwt'), AcceptedAuthGuard)
  // @Roles([Role.USER, Role.ADMIN])
  // getUserData(@GetAuthenticatedUser() user: User) {
  //   return this.authService.getUserMainData(user);
  // }

  @Delete('delete-user-account/:userId')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(Role.ADMIN)
  deleteUserAccount(@Param('userId') userId: number,@Response() res): Promise<any>{
    const user = this.authService.deleteUserAccount(userId);
    if(user){
      return res.json({
        status: true,
        message: 'تم حذف الموظف بنجاح',
      }) 
    }
  }

  @Get('check-username/:username')
  isValidUsername(@Param('username') username: string) {
    return this.authService.isValidUsername(username);
  }


  // @Post('login/admin')
  // signInAdmin(@Body() emailLoginDto: EmailLoginDto) {
  //   return this.authService.signInAdmin(emailLoginDto);
  // }

  @Get('system-users')
  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(Role.ADMIN || Role.STOREMANAGER)
  getSystemUsers(@Query('limit') limit: number,
  @Query('roles') roles: Role,
  @Query('username') username: string,
  @Query('skip') skip: number,
  @Query('sections') sections: SECTION,
  @Query('branch') branch: Branch,
  @Response() res :Response
  ) {
    return this.authService.getSystemUsers(limit,roles,username,skip,sections,branch,res);
  }

  @Get('users/:id')
  getUserById(@Param('id', ParseIntPipe) id: number ) {
    return this.authService.getUserById(id);
  }

  

  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(Role.ADMIN)
  @Patch('edit-user-roles/:userId')
  editUserRoles(@Param('userId', ParseIntPipe) userId: number, @Body() userRoleDto: UserRoleDto) {
    return this.authService.editUserRoles(userId, userRoleDto);
  }

  @UseGuards(AuthGuard(), AdminAuthGuard)
  @Roles(Role.ADMIN)
  @Put('edit-user-password/:userId')
  editUserPassword(@Param('userId', ParseIntPipe) userId: number, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.editUserPassword(userId, updatePasswordDto.password);
  }


}
