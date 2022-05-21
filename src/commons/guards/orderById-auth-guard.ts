import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { User } from '../../modules/auth/entities/user.entity';

@Injectable()
export class OrderByIdGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

    const roles = this.reflector.get<Role>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    if (user) {
      const hasRole = () => ( (user.roles === Role.STOREKEPPER || user.roles === Role.STOREMANAGER || user.roles === Role.ADMIN || user.roles === Role.SUPPLIERS  || user.roles === Role.SECTION ) ?  true : false);
      if(hasRole()){
        return true;
      }else{
        return false;
      }
    } else {
      return false;
    }

  }
}
