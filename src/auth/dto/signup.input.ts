import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { Role } from '@/user/models/user.model';

@InputType()
export class SignupInput {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  @ValidateIf((o) => o.college)
  @IsString()
  college?: string;

  @ValidateIf((o) => o.roles)
  @IsEnum(Role, { each: true })
  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}
