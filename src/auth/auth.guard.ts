import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const handler = ctx.getHandler();
    const expectedRoles = this.reflector.get<string[]>('roles', handler);

    if (!expectedRoles) {
      return true;
    }

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const hasRoles = () => {
      const r = !!user.roles.find(
        role => !!expectedRoles.find(item => item === role),
      );

      const rr = !!user.resourceRoles.find(
        role => !!expectedRoles.find(item => item === role),
      );

      return r || rr;
    };
    return true;
    if (user && user.roles && hasRoles()) {
      return true;
    } else {
      throw new UnauthorizedException('Missing roles');
    }
  }
}
