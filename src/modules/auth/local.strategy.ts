import { IStrategyOptionsWithRequest, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { isEmail, isNumberString } from 'class-validator';
import type { Request } from 'express';
import { isNumber } from 'lodash';

// loacal strategy
// 用于登录

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      passwordField: 'password',
      usernameField: 'username',
      passReqToCallback: true,
    } as IStrategyOptionsWithRequest);
  }

  async validate(
    req: Request,
    username: string,
    password: string,
  ): Promise<any> {
    let keyName: 'email' | 'id';
    let value: string | number = username;
    const ua = req.header('user-agent');

    if (isEmail(username)) {
      keyName = 'email';
    } else if (isNumber(username)) {
      keyName = 'id';
    } else if (isNumberString(username)) {
      keyName = 'id';
      value = Number(value);
    } else {
      throw new BadRequestException('用户名格式错误');
    }
    return await this.authService.loginValidate(value, keyName, password, ua);
  }
}
