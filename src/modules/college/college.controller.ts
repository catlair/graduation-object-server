import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CollegeService } from './college.service';

@Controller('college')
@ApiTags('学院')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Get()
  findAll() {
    return this.collegeService.findAll();
  }
}
