import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Many {
  @Field()
  count: number;
}
