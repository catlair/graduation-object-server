import { PageParams } from '@/dto/page-params';
import { ApiProperty } from '@nestjs/swagger';
import { PaperEnum } from '@prisma/client';
import { IsNumber, ValidateIf } from 'class-validator';

/**
 * 查询 paper 列表参数
 */
export class PaperListParams extends PageParams {
  @ApiProperty()
  @ValidateIf((o) => o.status)
  @IsNumber()
  status?: PaperEnum;
}
