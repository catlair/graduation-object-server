import { CreateCourseArg } from './create-course.arg';
import { ArgsType, PartialType, Field } from '@nestjs/graphql';

@ArgsType()
export class updateCourseArg extends PartialType(CreateCourseArg) {
  @Field()
  id: string;
}
