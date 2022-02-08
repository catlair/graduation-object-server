import { TimestampedModel } from '@/common/models/base.model';
import {
  ObjectType,
  registerEnumType,
  HideField,
  Field,
} from '@nestjs/graphql';

export enum Role {
  // 管理员
  ADMIN = 'ADMIN',
  // 教导处主任
  DIRECTOR = 'DIRECTOR',
  // 教导处副主任
  VICE_DIRECTOR = 'VICE_DIRECTOR',
  // 教师
  TEACHER = 'TEACHER',
  // 教师秘书
  SECRETARY = 'SECRETARY',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class User extends TimestampedModel {
  @Field()
  id: number;
  @Field()
  email: string;
  @Field()
  name: string;
  @Field(() => [Role], { nullable: true })
  roles?: Role[];
  @HideField()
  password: string;
  @Field({ nullable: true })
  college?: string;
}
