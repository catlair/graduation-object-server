import { IsDefined, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'demo@hello.word', maxLength: 20, minLength: 6 })
  @IsDefined()
  username: string | number;

  @IsString({ message: '密码必须是字符串' })
  @Length(6, 20, { message: '密码长度必须在6-20之间' })
  @ApiProperty({ example: '123456', maxLength: 20, minLength: 6 })
  password: string;
}
