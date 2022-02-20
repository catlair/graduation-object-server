import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class PaperUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  a: any;
  @ApiProperty({ type: 'string', format: 'binary' })
  b: any;
}

export class PaperUploadQueries {
  @ApiProperty()
  @ValidateIf((o) => o.college)
  @IsString()
  college?: string;

  @ApiProperty()
  @IsString()
  course: string;
}

export class PaperUploadUpdateDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
