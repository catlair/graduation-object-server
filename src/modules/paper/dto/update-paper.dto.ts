import { IsObject, IsString, ValidateIf } from 'class-validator';

export class UpdatePaperDto {
  @ValidateIf((o) => o.content)
  @IsString()
  content?: string;

  @ValidateIf((o) => o.fields)
  @IsObject()
  fields?: {
    a?: string;
    b?: string;
  };
}
