import {
  BadRequestException,
  ConflictException, 
  HttpException,
  HttpStatus, 
  Injectable,
  NotFoundException,
  Get ,
  Response,
  Res
} from '@nestjs/common';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { Role } from '../../commons/enums/role.enum';
import { SECTION } from 'src/commons/enums/section.type';
import { Branch } from 'src/commons/enums/branch.entity';
import { UserRoleDto } from './dto/user-ifno.dto';
import { JwtPayload } from '../../commons/interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { EmailLoginDto } from './dto/email-login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository,
              private jwtService: JwtService,
              ) {
  }

  async signUp(email:string,password: string,username:string,
    @Response() res 
   ): Promise<void> {
    // const { username, password, email  } = authCredentialsDto;
    console.log(username, password, email);
   
    const user = new User();
    user.salt = await bcrypt.genSalt();

    if ((await this.isValidUsername(username))) {
      // throw new BadRequestException( { status: false, data:null ,message:'اسم المستخدم يجب ان يكون نص'} );
      return res.json({
        status: false,
        data:null,
        message:'اسم المستخدم يجب ان يكون نص'
      })
    } else {
      user.username = username;
    }

    if ((await this.checkIfEmailExist(email))) {
      return res.json({
        status: false,
        data:null,
        message:'البريد الإلكتروني غير متوفر ، يرجى المحاولة مرة أخرى'
      })
    } else {
      user.email = email;
    }

    // user.roles = [Role.DEFAULT];
    // user.sections = [SECTION.DEFAULT];
    // user.branch = [Branch.DEFAULT];
    user.password = await this.userRepository.hashPassword(password, user.salt);
    user.orders = [];

    await user.save();
    
    return res.json({
      status: true,
      data: user,
      message: 'تم اضافه المستخدم بنجاح',
    })     
  }





  async setUserInfo(user: User, profile: any) {
    const { name, displayName, emails, photos } = profile;

    // check if email and username is available
    if ((await this.isValidUsername(displayName))) {
      throw new ConflictException(`Username ${displayName} is not available, please try another one`);
    }
    if ((await this.checkIfEmailExist(emails[0].value))) {
      throw new ConflictException(`Email ${emails[0].value} is not available, please try another one`);
    }
    user.username = displayName;
    user.email = emails[0].value;
    // user.roles = [Role.USER];
    return user;
  }


  // async getUserMainData(user: User): Promise<{ user: User, profile: Profile }> {
  //   const profile = await this.profileService.getProfileData(user);
  //   return {
  //     user,
  //     profile,
  //   };
  // }

  async signInUser(email:string,password:string,@Response() res ): Promise<{token: string,user: User}> {
   
    const { user } = await this.userRepository.validateUserPassword(email,password);
    const token = this.generateJwtToken(email);
    delete user.password;
     delete user.salt;
     if(user){
       return res.json({
        status: true,
        data:user,
        token:token,
        message: 'تم تسجيل الدخول بنجاح',
      })
     }else{
        throw new HttpException( { status: false, data:null ,message:'خطا خطأ بالبريد الاليكتروني او كلمه المرور'} , HttpStatus.NOT_FOUND);
     }
  }

  async checkIfEmailExist(email: string): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder('user');
    const isEmailExist = query.select('email')
      .where('user.email LIKE :email', { email });
    const count = await isEmailExist.getCount();
    return count >= 1;
  }


  // this method well be used in different methods
  generateJwtToken(email: string) {
    const payload: JwtPayload = { email };
    const jwt = this.jwtService.sign(payload);
    return jwt;
  }

  isValidEmail(email: string) {
    if (email) {
      const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(email);
    } else
      return false;
  }


  

  async checkPassword(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new HttpException('User Does not Found', HttpStatus.NOT_FOUND);
    }
    return await bcrypt.compare(password, user.password);
  }



  async editUserPassword(id: number, password:string) {
     const user = await this.getUserById(id);
     console.log(user);
    if (!user) {
      throw new HttpException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    user.password = await this.userRepository.hashPassword(password, user.salt);
    await user.save();
    delete user.password;
    delete user.salt;
    return user;
  }

  // async signInAdmin(emailLoginDto: EmailLoginDto): Promise<{ accessToken: string, user: User }> {
  //   if (!(this.isValidEmail(emailLoginDto.email))) {
  //     throw new BadRequestException(' البريد الإلكتروني غير صحيح');
  //   }
  //   const { email, user } = await this.userRepository.validateAdminPassword(emailLoginDto);
  //   const payload: JwtPayload = { email };
  //   const accessToken = this.jwtService.sign(payload);
  //   return { accessToken, user };
  // }
  // limit,roles,username,skip,section,branch,res
  async getSystemUsers(limit:number,roles:Role,username: string,skip: number,sections:SECTION,branch:Branch,res): Promise<User[]> {
    return await this.userRepository.getFilteredUsers(limit,roles,username,skip,sections,branch,res);
  }

  async getUserById(id: number) : Promise<User>{
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`المستخدم غير موجود`);
    }
    return user
    // return res.json({
    //   status: 'success',
    //   data: user,
    // })  
  }

  async editUserRoles(id: number, userRoleDto: UserRoleDto): Promise<any> {
    const user = await this.getUserById(id);
    if (userRoleDto.type) {
      user.roles = userRoleDto.type;
    }
    if (userRoleDto.branch) {
      user.branch = userRoleDto.branch;
    }
    if (userRoleDto.section) {
      user.sections = userRoleDto.section;
    }
     await user.save();
     delete user.password;
     delete user.salt;
     return user;
    // return res.json({
    //   status: 'success',
    //   message:'تم تحديث بيانات الموظف بنجاج'
    // }) 
  }

  async deleteUserAccount(id: number) {
    await this.userRepository.delete(id);
  }

  async isValidUsername(username: string): Promise<boolean> {
    const query = this.userRepository.createQueryBuilder('user').select('username');
    query.where('user.username LIKE :username', { username });
    const count = await query.getCount();
    return count >= 1;
  }

 
 
}
