import { IsNotEmpty } from 'class-validator';

export class ValidateCaptchaArgs {
  @IsNotEmpty()
  key: string;
  @IsNotEmpty()
  code: string;
}
