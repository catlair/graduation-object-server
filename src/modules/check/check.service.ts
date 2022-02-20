import { Injectable } from '@nestjs/common';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';

@Injectable()
export class CheckService {
  create(createCheckDto: CreateCheckDto) {
    return 'This action adds a new check';
  }

  findAll() {
    return `This action returns all check`;
  }

  findOne(id: number) {
    return `This action returns a #${id} check`;
  }

  update(id: number, updateCheckDto: UpdateCheckDto) {
    return `This action updates a #${id} check`;
  }

  remove(id: number) {
    return `This action removes a #${id} check`;
  }
}
