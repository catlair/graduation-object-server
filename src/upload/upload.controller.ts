import { RestAuth } from '@/common/decorators/auth.decorator';
import { UserEntity } from '@/common/decorators/user.decorator';
import { User } from '@/user/models/user.model';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@Controller('hello')
@ApiTags('hello')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  hello() {
    return this.uploadService.hello();
  }

  @Get('/me')
  @RestAuth()
  me(@UserEntity() user: User) {
    delete user.password;
    return user;
  }
}
