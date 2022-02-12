import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
//Strategy 这个一定是jwt中的,不要因为复制粘贴用到了local的,导致不报错但是验证失败
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Configuration } from '../../config/configuration';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { JwtDto } from './dto/jwt.dto';

// jwt strategy
// 用于验证用户的token是否合法

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService<Configuration>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtDto): Promise<JwtDto> {
    // const user = await this.authService.validateUser(payload.id);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
    return payload;
  }
}
