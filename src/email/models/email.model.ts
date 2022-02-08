import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Email {
  @Field()
  name: string;
  @Field()
  email: string;
  @HideField()
  code: string;
  @Field()
  createdAt: Date;
}
