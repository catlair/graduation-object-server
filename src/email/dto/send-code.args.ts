import { ArgsType } from '@nestjs/graphql';
import { IsEmail, IsString, ValidateIf } from 'class-validator';

@ArgsType()
export class SendEmailCodeArgs {
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ValidateIf((o) => o.name)
  @IsString({ message: '验证码类型必须为字符串' })
  name?: string;
}
