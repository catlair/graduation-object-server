import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './models/course.model';
import {
  CreateCourseArg,
  CreateCourseManyInput,
} from './dto/create-course.arg';
import { updateCourseArg } from './dto/update-course.arg';
import { CourseArg } from './dto/course.arg';
import { Many } from '@/common/models/prisma.model';

@Resolver(() => Course)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation(() => Course)
  createCourse(@Args() payload: CreateCourseArg) {
    return this.courseService.create(payload);
  }

  @Mutation(() => Many)
  createCourseMany(@Args('data') names: CreateCourseManyInput) {
    return this.courseService.createMany(names);
  }

  @Query(() => [Course], { name: 'course' })
  findAll() {
    return this.courseService.findAll();
  }

  @Query(() => Course, { name: 'course' })
  findOne(@Args() { id, name }: CourseArg) {
    return id
      ? this.courseService.findOne(id)
      : this.courseService.findOneByName(name);
  }

  @Mutation(() => Course)
  updateCourse(@Args() payload: updateCourseArg) {
    return this.courseService.update(payload);
  }

  @Mutation(() => Course)
  removeCourse(@Args() { id, name }: CourseArg) {
    return id
      ? this.courseService.remove(id)
      : this.courseService.removeByName(name);
  }

  @Mutation(() => Course)
  removeCourseMany(@Args('ids', { type: () => [String] }) ids: string[]) {
    return this.courseService.removeMany(ids);
  }
}
