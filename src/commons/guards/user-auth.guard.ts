import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { User } from '../../modules/auth/entities/user.entity';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role>('roles', context.getHandler);
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest(); // --> fetching request object
    const user: User = req.user;
    if (user) {
    //   const hasRole = () => user.roles.some(role => role === Role.USER);
    const hasRole = () => ( user.roles === Role.DEFAULT ?  true : false);
  if(hasRole()){
    return true;
  }else{
    return false;
  }
}else {
  return false;
}
  }

}
