import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  hello() {
    return {
      message: 'Hello World!',
    };
  }
}
