import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '@/common/models/pagination/pagination';
import { Post } from './post.model';

@ObjectType()
export class PostConnection extends PaginatedResponse(Post) {}
