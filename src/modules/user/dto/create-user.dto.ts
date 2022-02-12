import { Role } from '@/enums/role.enum';
import {
  IsNumber,
  IsNotEmpty,
  IsEmail,
  MinLength,
  ValidateIf,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;

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
