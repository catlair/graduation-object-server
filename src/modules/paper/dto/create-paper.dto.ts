import { IsString, Length, ValidateIf } from 'class-validator';

export class CreatePaperDto {
  @IsString()
  college: string;

  @ValidateIf((o) => o.remark)
  @IsString()
  remark?: string;

  @IsString()
  @Length(1, 24)
  course: string;

  @IsString()
  @Length(10, 50)
  aName: string;

  @IsString()
  @Length(10, 50)
  bName: string;
}
