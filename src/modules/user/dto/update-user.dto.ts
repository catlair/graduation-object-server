import { Role } from '@/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @ValidateIf((o) => o.name)
  @ApiProperty()
  @IsString()
  name?: string;

  @ValidateIf((o) => o.college)
  @ApiProperty()
  @IsString()
  college?: string;

  @ValidateIf((o) => o.roles)
  @ApiProperty()
  @IsEnum(Role, { each: true })
  roles?: Role;

  @ValidateIf((o) => o.email)
  @ApiProperty()
  @IsEmail()
  email?: string;
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
