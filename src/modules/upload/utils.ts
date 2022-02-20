import { paperTypes } from '@/enums/mimetype';
import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';

export const paperStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('/Users/Desktop/git/server', './uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const paperFilter: MulterOptions['fileFilter'] = (req, file, cb) => {
  if (paperTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('文件类型不被允许'), false);
  }
};
