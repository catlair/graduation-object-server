import { IsEmail, IsNumber, IsString, IsUUID, Length } from 'class-validator';

export class UpdateUserDto {
  name?: string;

  college?: string;
}

export class ChangeEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6)
  code: string;
}

export class UpdateEmailDto {
  @IsUUID()
  key: string;

  @IsNumber()
  userId: number;
}
