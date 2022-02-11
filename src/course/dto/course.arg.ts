import { ArgsType, Field } from '@nestjs/graphql';
import { IsString, MaxLength, ValidateIf } from 'class-validator';

@ArgsType()
export class CourseArg {
  @Field()
  @ValidateIf((o) => o.id || !o.name)
  @IsString()
  id?: string;

  @Field()
  @ValidateIf((o) => !o.id)
  @IsString()
  @MaxLength(20)
  name?: string;
}

@ArgsType()
export class CourseManyArg {
  @Field()
  @ValidateIf((o) => o.id || !o.name)
  @IsString({
    each: true,
  })
  ids?: string;

  @Field()
  @ValidateIf((o) => !o.id)
  @IsString({
    each: true,
  })
  @MaxLength(20, {
    each: true,
  })
  names?: string;
}
