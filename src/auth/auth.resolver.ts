import { Auth, Logout } from './models/auth.model';
import { Token } from '@/common/models/token.model';
import { User } from '../user/models/user.model';
import { LoginInput } from './dto/login.input';
import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from '@/common/guards';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.createUser(data);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async login(@Args('data') { email, password, id }: LoginInput) {
    const { accessToken, refreshToken } = await this.auth.login(
      email?.toLowerCase(),
      id,
      password,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Logout)
  @UseGuards(GqlAuthGuard)
  async logout(@Args() { token }: RefreshTokenInput) {
    return await this.auth.logout(token);
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}
