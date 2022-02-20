import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class CollegeService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.college.findMany();
  }
}
