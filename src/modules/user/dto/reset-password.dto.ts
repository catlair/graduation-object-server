import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(6)
  code: string;

  @ApiProperty()
  @IsString()
  @Length(6, 20, {
    message: '密码长度必须在6-20之间',
  })
  password: string;
}
