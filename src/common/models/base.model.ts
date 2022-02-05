import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class TimestampedModel {
  @Field({
    description: 'Identifies the date and time when the object was created.',
  })
  createdAt: Date;
  @Field({
    description:
      'Identifies the date and time when the object was last updated.',
  })
  updatedAt: Date;
}

@ObjectType({ isAbstract: true })
export abstract class BaseModel extends TimestampedModel {
  @Field(() => ID)
  id: string;
}
