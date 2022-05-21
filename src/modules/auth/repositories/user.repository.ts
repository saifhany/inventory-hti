import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BadRequestException, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from '../../../commons/enums/role.enum';
import { Branch } from '../../../commons/enums/branch.entity';
import { SECTION } from '../../../commons/enums/section.type';
import { EmailLoginDto } from '../dto/email-login.dto';
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getFilteredUsers( limit: number,roles:Role,username: string,skip: number,sections:SECTION,branch: Branch,res): Promise<User[]> {
    const query = this.createQueryBuilder('user').select("user.id").addSelect("user.username").addSelect("user.email").addSelect("user.roles").addSelect("user.branch").addSelect("user.sections")
    if(limit){
      query.limit(limit);
    }
    if(skip){
      query.skip(skip);
    }
    if(roles){
      query.where('user.roles =:roles',{roles})
    }
    if(branch){
      query.andWhere('user.branch =:branch',{branch})
    }
    if(sections){
      query.andWhere('user.sections =:sections',{sections})
    }
    // LIKE '%books%'
    if(username){
      query.andWhere("LOWER(username) LIKE :username", { username: `%${ username.toLowerCase() }%` })
    }
    // query.("user.password").excludeSelect("user.salt");
    const result = await query.getMany();
    const userCount = result.length;
    return res.json({
      result, userCount
    })
  }
  

  async findByEmail(email: string): Promise<User> {
    return await this.findOne({ email });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.findOne({ username });
  }

  async validateUserPassword(email:string,password:string): Promise<{ email: string, user: User }> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new BadRequestException( { status: false, data:null ,message:' خطأ بالبريد الاليكتروني او كلمه المرور'});
      
    }
   
    if ((await user.validatePassword(password))) {
      return { email, user };
      
    } else {
      // throw new BadRequestException('كلمة المرور الخاصة بك غير صحيحة ، يرجى إدخال كلمة مرور أخرى ');
      throw new BadRequestException( { status: false, data:null ,message:' خطأ بالبريد الاليكتروني او كلمه المرور'});
    }
  }


  async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
