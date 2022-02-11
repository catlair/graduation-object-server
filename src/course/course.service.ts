import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateCourseArg,
  CreateCourseManyInput,
} from './dto/create-course.arg';
import { updateCourseArg } from './dto/update-course.arg';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  create({ name }: CreateCourseArg) {
    return this.prisma.course.create({
      data: {
        name,
      },
    });
  }

  async createMany(payload: CreateCourseManyInput) {
    return await this.prisma.course.createMany({
      data: payload.names.map((name) => ({ name })),
    });
  }

  findAll() {
    return this.prisma.course.findMany();
  }

  findOne(id: string) {
    return this.prisma.course.findUnique({
      where: {
        id,
      },
    });
  }

  findOneByName(name: string) {
    return this.prisma.course.findUnique({
      where: {
        name,
      },
    });
  }

  update({ id, name }: updateCourseArg) {
    return this.prisma.course.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
  }

  remove(id: string) {
    return this.prisma.course.delete({
      where: {
        id,
      },
    });
  }

  removeByName(name: string) {
    return this.prisma.course.delete({
      where: {
        name,
      },
    });
  }

  removeMany(ids: string[]) {
    return this.prisma.course.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
