import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      console.log(roles);
      return true;
    }
    const request = context.switchToHttp().getRequest();

    return this.matchRoles(request.user.roles, roles);
  }

  private matchRoles(userRoles: string[], roles: string[]): boolean {
    for (const userRole of userRoles) {
      if (roles.includes(userRole)) {
        return true;
      }
    }
  }
}
