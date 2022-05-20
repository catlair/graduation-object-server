import { Role } from '@/enums/role.enum';
import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  ValidateIf,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ValidateIf((o) => o.college)
  @IsString()
  @ApiProperty()
  college?: string;

  @ValidateIf((o) => o.roles)
  @IsEnum(Role, { each: true })
  @ApiProperty()
  roles?: Role[];
}
