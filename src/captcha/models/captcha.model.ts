import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Captcha {
  @Field({ description: 'svg captcha' })
  svg: string;
  @Field({ description: 'captcha key' })
  key: string;
}
