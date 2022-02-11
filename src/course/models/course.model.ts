import { BaseModel } from '@/common/models/base.model';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Course extends BaseModel {
  @Field()
  name: string;
}
