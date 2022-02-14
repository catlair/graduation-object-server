import { ApiProperty } from '@nestjs/swagger';

export class PaperUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  paperA: any;
  @ApiProperty({ type: 'string', format: 'binary' })
  paperB: any;
}
