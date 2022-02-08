import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/user/models/user.model';
import { Token } from '@/common/models/token.model';

@ObjectType()
export class Auth extends Token {
  user: User;
}

@ObjectType()
export class Logout {
  @Field({ nullable: true })
  message: string;
}
