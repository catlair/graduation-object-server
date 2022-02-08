import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNumber, IsString, IsUUID, Length } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  college?: string;
}

@InputType()
export class ChangeEmailInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @Length(6)
  code: string;
}

@InputType()
export class UpdateEmailInput {
  @Field()
  @IsUUID()
  key: string;

  @Field()
  @IsNumber()
  userId: number;
}
