import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, ValidateIf } from 'class-validator';

export class SendEmailCodeDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  @ApiProperty()
  email: string;

  @ValidateIf((o) => o.name)
  @IsString({ message: '验证码类型必须为字符串' })
  name?: string;
}
