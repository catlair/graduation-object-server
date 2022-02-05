import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ValidateCaptcha {
  @Field({ nullable: true })
  code: string;
  @Field()
  valid: boolean;
}
