import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  name: string;

  @ValidateIf((o) => o.college)
  @IsString()
  college?: string;
}
