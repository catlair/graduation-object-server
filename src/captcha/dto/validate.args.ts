import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class ValidateCaptchaArgs {
  @IsNotEmpty()
  key: string;
  @IsNotEmpty()
  code: string;
}
