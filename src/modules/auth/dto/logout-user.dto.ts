import { IsJWT } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutUserDto {
  @IsJWT()
  @ApiProperty()
  token: string;
}
