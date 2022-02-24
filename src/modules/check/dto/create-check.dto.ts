import { ApiProperty } from '@nestjs/swagger';
import { PaperLifeEnum } from '@prisma/client';
import { IsString, ValidateIf } from 'class-validator';

export class CreateCheckDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @ValidateIf((o) => o.images)
  @IsString({ each: true })
  images?: string[];

  @ApiProperty()
  @IsString()
  status: PaperLifeEnum;

  @ApiProperty()
  @IsString()
  paperId: string;
}
