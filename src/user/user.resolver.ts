import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserEntity } from '@/common/decorators/user.decorator';
import { User } from './models/user.model';
import { ChangeEmail } from './models/email.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UserService } from './user.service';
import {
  UpdateUserInput,
  ChangeEmailInput,
  UpdateEmailInput,
} from './dto/update-user.input';
import { Auth } from '@/common/decorators/auth.decorator';

@Resolver(() => User)
@Auth()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @Auth()
  @Mutation(() => User)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') newUserData: UpdateUserInput,
  ) {
    return this.userService.updateUser(user.id, newUserData);
  }

  @Auth()
  @Mutation(() => ChangeEmail)
  async changeEmail(
    @UserEntity() user: User,
    @Args('data') payload: ChangeEmailInput,
  ) {
    return this.userService.changeEmail(user.id, payload);
  }

  @Mutation(() => ChangeEmail)
  async updateEmail(@Args('data') { key, userId }: UpdateEmailInput) {
    return this.userService.updateEmail(key, userId);
  }

  @Auth()
  @Mutation(() => User)
  async changePassword(
    @UserEntity() user: User,
    @Args('data') changePassword: ChangePasswordInput,
  ) {
    return this.userService.changePassword(
      user.id,
      user.password,
      changePassword,
    );
  }
}
