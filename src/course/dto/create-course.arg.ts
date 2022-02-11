import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@ArgsType()
export class CreateCourseArg {
  @MaxLength(20)
  name: string;
}

@InputType()
export class CreateCourseManyInput {
  @Field(() => [String])
  @MaxLength(20, {
    each: true,
  })
  names: string[];
}
