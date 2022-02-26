import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 20, {
    message: '密码长度必须在6-20之间',
  })
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 20, {
    message: '密码长度必须在6-20之间',
  })
  password: string;
}
