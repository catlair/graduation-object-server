import { IStrategyOptionsWithRequest, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { isEmail, isNumberString } from 'class-validator';
import type { Request } from 'express';
import { isNumber } from 'lodash';
import { LoginEmailUserDto, LoginUserDto } from './dto/login-user.dto';
import { validateErrThrow } from '@/utils';

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
    validateErrThrow(LoginUserDto, { username, password });

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

@Injectable()
export class LocalEmailStrategy extends PassportStrategy(
  Strategy,
  'local-email',
) {
  constructor(private readonly authService: AuthService) {
    super({
      passwordField: 'code',
      usernameField: 'email',
      passReqToCallback: true,
    } as IStrategyOptionsWithRequest);
  }

  async validate(req: Request, email: string, code: string): Promise<any> {
    validateErrThrow(LoginEmailUserDto, { email, code });

    const ua = req.header('user-agent');

    return await this.authService.loginByEmail(email, code, ua);
  }
}
