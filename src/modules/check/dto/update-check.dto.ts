import { PartialType } from '@nestjs/swagger';
import { CreateCheckDto } from './create-check.dto';

export class UpdateCheckDto extends PartialType(CreateCheckDto) {}
