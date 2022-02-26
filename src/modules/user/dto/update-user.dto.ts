import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, IsUUID, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  college?: string;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsEmail()
  oldEmail: string;

  @ApiProperty()
  @IsString()
  @Length(6)
  code: string;
}

export class UpdateEmailDto {
  @ApiProperty()
  @IsUUID()
  key: string;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
