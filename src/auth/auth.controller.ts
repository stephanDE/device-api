import {
  Controller,
  Inject,
  Post,
  Body,
  HttpService,
  BadRequestException,
  Get,
  UnauthorizedException,
} from '@nestjs/common';

import { Config } from '../config/config.interface';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { stringify } from 'querystring';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('CONFIG') private config: Config,
    private httpService: HttpService,
  ) {}

  // ---------------- REST --------------------

  @Post('')
  async authUser(@Body() requestBody: any): Promise<any> {
    const { username, password } = requestBody;
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    try {
      const result = await this.httpService
        .post(
          `http://${this.config.auth.host}:8080/auth/realms/${this.config.auth.realm}/protocol/openid-connect/token`,
          stringify({
            grant_type: 'password',
            client_id: this.config.auth.resource,
            client_secret: this.config.auth.clientSecret,
            username,
            password,
            scope: 'roles',
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe(
          map(res => {
            return res.data;
          }),
        )
        .toPromise();
      return of(result);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('unauthorized');
    }
  }

  @Get('')
  async get(): Promise<any> {
    return 'geht geht aber';
  }
}
