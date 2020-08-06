import {
  Injectable,
  NestMiddleware,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

import { Config } from '../config/config.interface';
import { ExtendedRequest } from './auth.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly AUTH_SCHEMA = 'Bearer';

  constructor(
    @Inject('CONFIG') private config: Config,
    private jwtService: JwtService,
  ) {}

  use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const algorithms = this.config.auth.algorithms as any[];
    const issuer = this.config.auth.issuer;
    const authHeader: string[] = req.headers.authorization
      ? req.headers.authorization.split(' ')
      : [''];

    if (authHeader[0] === this.AUTH_SCHEMA) {
      const token = authHeader[1];

      try {
        const validToken = this.jwtService.verify(token, {
          algorithms,
          issuer,
        });
        if (validToken) {
          let roles = validToken.scope || [];
          let resourceRoles = [];

          try {
            roles = validToken.realm_access.roles;
          } catch (error) {
            roles = validToken.scope || [];
          }

          try {
            resourceRoles =
              validToken.resource_access[this.config.auth.resource].roles;
          } catch (error) {
            resourceRoles = [];
          }

          req.user = {
            id: validToken.sub,
            name: validToken.preferred_username || validToken.name,
            clientId: validToken.clientId,
            roles,
            resourceRoles,
          };
        }
      } catch (err) {
        const message = err.message ? err.message : 'Invalid Token';
        throw new UnauthorizedException(message);
      }
    } else {
      throw new UnauthorizedException(
        `Unsupported authentication method: ${authHeader[0]}. Please use 'bearer' instead.`,
      );
    }

    next();
  }
}
