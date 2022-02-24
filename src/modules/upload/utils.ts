import { imgTypes, paperTypes } from '@/enums/mimetype';
import { BadRequestException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';

export const paperStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(process.cwd(), './uploads/paper'));
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

export const pictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(process.cwd(), './uploads/img'));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      crypto.createHmac('md5', file.originalname).digest('hex') +
        new Date().getTime() +
        path.extname(file.originalname),
    );
  },
});

export const pictureFilter: MulterOptions['fileFilter'] = (req, file, cb) => {
  if (imgTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('图片类型不被允许'), false);
  }
};
