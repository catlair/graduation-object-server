import word2pdf from '@/utils/office';
import { Injectable, Logger } from '@nestjs/common';
import { isEmpty } from 'lodash';
import path = require('path');
import fs = require('fs');
import { PaperUploadQueries } from './dto/paper-upload.dto';
import { JwtDto } from '../auth/dto/jwt.dto';
import { getPaperName } from '../paper/utils';

@Injectable()
export class UploadService {
  private renameFile(
    files: Express.Multer.File,
    fieldname: 'aName' | 'bName',
    query: PaperUploadQueries,
    user: JwtDto,
  ) {
    const paperName = getPaperName(query.course, user.id)[fieldname];
    const ext = path.extname(files.filename);
    const thatPath = `${files.destination}/${paperName}`;
    const filename = `${thatPath}${ext}`;
    fs.renameSync(files.path, filename);
    // 异步的进行，成功失败对后续操作不影响
    if (ext !== '.pdf') {
      word2pdf(filename, `${thatPath}.pdf`).catch((err) => {
        Logger.log(err.message || err, 'UploadService');
      });
    }
    return `${paperName}${ext}`;
  }

  uploadPaperFile(
    files: {
      a: Express.Multer.File[];
      b: Express.Multer.File[];
    },
    query: PaperUploadQueries,
    user: JwtDto,
  ) {
    if (isEmpty(files)) {
      return null;
    }
    const {
      a: [a],
      b: [b],
    } = files;
    const prefix = query.course + user.id;

    return {
      a: prefix + 'a' + path.extname(a.filename),
      b: prefix + 'b' + path.extname(b.filename),
    };
  }

  async updatePaperFile(files: Express.Multer.File[]) {
    const { fieldname, filename } = files[0];
    if (fieldname !== 'a' && fieldname !== 'b') {
      return null;
    }

    return {
      filename,
    };
  }

  deletePicture(imgPath: string) {
    try {
      fs.unlinkSync(path.resolve(process.cwd(), './uploads/img', imgPath));
      return {
        path: imgPath,
      };
    } catch (error) {
      Logger.error(error.message || error, 'Upload');
      return null;
    }
  }
}
