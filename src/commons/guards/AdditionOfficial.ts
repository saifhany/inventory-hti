import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { User } from '../../modules/auth/entities/user.entity';
import { Branch } from '../enums/branch.entity';

@Injectable()
export class AdditionOfficial implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role>('roles', context.getHandler);
    // const branches = this.reflector.get<Branch>('branches', context.getHandler);
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    if (user) {
    //   const hasRole = () => user.roles.some(role => role === Role.ADMIN || role === Role.USER);
    const hasRole = () => ( user.roles === (Role.ADDITIONOFFICIAL) ?  true : false);
    if (hasRole()) {
      return true;
    }else{
      return false;
    }
    } else {
      return false;
    }
  }

}
