import { IsString, ValidateIf } from 'class-validator';

export class UpdatePaperDto {
  @ValidateIf((o) => o.content)
  @IsString()
  content?: string;
}
