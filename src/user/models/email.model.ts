import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ChangeEmail {
  @Field()
  email: string;

  @Field()
  userId: string;
}
