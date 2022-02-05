import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserEntity } from '@/common/decorators/user.decorator';
import { User } from './models/user.model';
import { ChangePasswordInput } from './dto/change-password.input';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
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
