import { TimestampedModel } from '@/common/models/base.model';
import { ObjectType, registerEnumType, HideField } from '@nestjs/graphql';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

@ObjectType()
export class User extends TimestampedModel {
  id: number;
  email: string;
  name: string;
  role: Role;
  @HideField()
  password: string;
  college?: string;
  createdAt: Date;
  updatedAt: Date;
}
