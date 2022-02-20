import { IsNumber, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PageParams {
  @ApiProperty()
  @ValidateIf((o) => o.current)
  @IsNumber()
  @Type(() => Number)
  current?: number;

  @ApiProperty()
  @ValidateIf((o) => o.pageSize)
  @IsNumber()
  @Type(() => Number)
  pageSize?: number;
}

export type Pagination<D = any> = {
  data: D;
  success: boolean;
  current: number;
  pageSize: number;
  total: number;
};
