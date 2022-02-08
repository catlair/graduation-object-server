import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @ValidateIf((o) => o.id || !o.email)
  @Field()
  @IsNumber()
  id?: number;

  @ValidateIf((o) => !o.id)
  @Field()
  @IsEmail()
  email?: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
