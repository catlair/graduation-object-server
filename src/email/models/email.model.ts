import { Field, Float, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Email {
  @Field()
  name: string;
  @Field()
  email: string;
  @HideField()
  code: string;
  @Field(() => Float)
  createdAt: number;
}
