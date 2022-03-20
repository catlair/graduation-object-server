import { IsString, Length, ValidateIf } from 'class-validator';

export class CreatePaperDto {
  @IsString()
  college: string;

  @ValidateIf((o) => o.remark)
  @IsString()
  @Length(0, 191, { message: '备注不能超过191个字符' })
  remark?: string;

  @IsString()
  @Length(1, 24, { message: '课程名称长度不能超过24个字符' })
  course: string;

  @IsString()
  @Length(1, 50, { message: '文件名长度不能超过50' })
  aName: string;

  @IsString()
  @Length(1, 50, { message: '文件名长度不能超过50' })
  bName: string;
}
